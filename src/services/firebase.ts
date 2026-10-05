import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import { PlantAnalysisResult } from './plantAnalysis/types';
import { Language } from '../utils/i18n';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
export const storage = getStorage(app);

export interface SavedScanRecord extends PlantAnalysisResult {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: any;
  createdAtFormatted?: string;
  language: Language;
}

const LOCAL_STORAGE_KEY_PREFIX = 'phytoscan_scans_';

export function getGuestUserId(): string {
  try {
    let guestId = localStorage.getItem('phytoscan_guest_user_id');
    if (!guestId) {
      guestId = `farmer_guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('phytoscan_guest_user_id', guestId);
    }
    return guestId;
  } catch {
    return 'farmer_guest_local';
  }
}

export function getActiveUserId(): string {
  return auth.currentUser?.uid || getGuestUserId();
}

function getLocalScans(userId: string): SavedScanRecord[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalScan(scan: SavedScanRecord): void {
  try {
    const list = getLocalScans(scan.userId);
    const updated = [scan, ...list.filter((s) => s.id !== scan.id)];
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PREFIX}${scan.userId}`,
      JSON.stringify(updated.slice(0, 50))
    );
  } catch (err) {
    console.warn('Local scan cache write failed:', err);
  }
}

function deleteLocalScan(scanId: string, userId: string): void {
  try {
    const list = getLocalScans(userId);
    const updated = list.filter((s) => s.id !== scanId);
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PREFIX}${userId}`,
      JSON.stringify(updated)
    );
  } catch (err) {
    console.warn('Local scan cache delete failed:', err);
  }
}

/**
 * Ensures user auth state is initialized.
 * Gracefully falls back to null if anonymous sign-in is disabled in project.
 */
export async function ensureUser(): Promise<User | null> {
  if (auth.currentUser) {
    return auth.currentUser;
  }
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          try {
            const credential = await signInAnonymously(auth);
            resolve(credential.user);
          } catch {
            // Project does not have anonymous auth provider enabled (auth/admin-restricted-operation).
            // Gracefully fall back to local persistent guest identity.
            resolve(null);
          }
        }
      },
      () => {
        unsubscribe();
        resolve(null);
      }
    );
  });
}

/**
 * Upload image to Firebase Storage with a safe fallback
 */
export async function uploadPlantImage(
  dataUrl: string,
  userId: string
): Promise<string> {
  const timestamp = Date.now();
  const filename = `scans/${userId}/${timestamp}.jpg`;
  const storageRef = ref(storage, filename);

  try {
    // Attempt standard Firebase Storage upload
    await uploadString(storageRef, dataUrl, 'data_url');
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch {
    // Return data URL as reliable fallback
    return dataUrl;
  }
}

/**
 * Save scan result to Firestore associated with the user, and cache locally
 */
export async function saveScanToFirestore(
  result: PlantAnalysisResult,
  imageUrl: string,
  userId: string,
  language: Language
): Promise<string> {
  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date();
  const formattedDate = now.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const scanRecord: SavedScanRecord = {
    id: scanId,
    userId: userId,
    imageUrl: imageUrl,
    timestamp: null,
    createdAtFormatted: formattedDate,
    condition: result.condition,
    confidence: result.confidence,
    severity: result.severity,
    observations: result.observations || [],
    possibleCauses: result.possibleCauses || [],
    recommendedActions: result.recommendedActions || [],
    prevention: result.prevention || [],
    uncertaintyNote: result.uncertaintyNote || '',
    language: language,
    classifierMetadata: result.classifierMetadata || undefined,
  };

  // Cache locally first for instantaneous UX and resilient offline support
  saveLocalScan(scanRecord);

  try {
    const scanRef = doc(db, 'scans', scanId);
    await setDoc(scanRef, {
      ...scanRecord,
      timestamp: serverTimestamp(),
      createdAtISO: now.toISOString(),
    });
  } catch (firestoreErr) {
    console.warn('Firestore write notice (saved to local device cache):', firestoreErr);
  }

  return scanId;
}

/**
 * Retrieve scans for the given user from Firestore and local cache
 */
export async function getUserScans(userId: string): Promise<SavedScanRecord[]> {
  const localList = getLocalScans(userId);

  try {
    const scansCol = collection(db, 'scans');
    const q = query(scansCol, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const remoteRecords: SavedScanRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let formattedDate = 'Recently';
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        formattedDate = data.timestamp.toDate().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (data.createdAtISO) {
        formattedDate = new Date(data.createdAtISO).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }

      remoteRecords.push({
        id: docSnap.id,
        userId: data.userId,
        imageUrl: data.imageUrl,
        timestamp: data.timestamp,
        createdAtFormatted: formattedDate,
        condition: data.condition || 'Unknown',
        confidence: data.confidence || 0,
        severity: data.severity || 'Moderate',
        observations: data.observations || [],
        possibleCauses: data.possibleCauses || [],
        recommendedActions: data.recommendedActions || [],
        prevention: data.prevention || [],
        uncertaintyNote: data.uncertaintyNote || '',
        language: data.language || 'en',
        classifierMetadata: data.classifierMetadata,
      });
    });

    // Merge remote with local scans by id
    const map = new Map<string, SavedScanRecord>();
    for (const r of remoteRecords) {
      map.set(r.id, r);
    }
    for (const l of localList) {
      if (!map.has(l.id)) {
        map.set(l.id, l);
      }
    }

    const merged = Array.from(map.values());
    return merged.sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    });
  } catch {
    // If Firestore call encounters an issue, return local cached scans
    return localList;
  }
}

/**
 * Delete a scan from Firestore and local cache
 */
export async function deleteUserScan(scanId: string, userId?: string): Promise<void> {
  const activeId = userId || getActiveUserId();
  deleteLocalScan(scanId, activeId);

  try {
    const scanRef = doc(db, 'scans', scanId);
    await deleteDoc(scanRef);
  } catch (err) {
    console.warn('Firestore delete notice:', err);
  }
}

export {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
