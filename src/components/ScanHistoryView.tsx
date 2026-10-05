import React, { useState } from 'react';
import { SavedScanRecord, deleteUserScan } from '../services/firebase';
import { Language, translations } from '../utils/i18n';
import {
  History,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface ScanHistoryViewProps {
  scans: SavedScanRecord[];
  onSelectScan: (scan: SavedScanRecord) => void;
  onRefreshScans: () => void;
  onGoHome: () => void;
  language: Language;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  onSelectScan,
  onRefreshScans,
  onGoHome,
  language,
}) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredScans = scans.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.condition?.toLowerCase().includes(term) ||
      s.severity?.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (e: React.MouseEvent, scanId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this scan record?')) return;
    setDeletingId(scanId);
    try {
      await deleteUserScan(scanId);
      onRefreshScans();
    } catch (err) {
      console.error('Delete scan failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const s = severity?.toLowerCase() || '';
    if (s.includes('severe') || s.includes('தீவிர')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (s.includes('mod') || s.includes('மித')) {
      return 'bg-amber-100 text-amber-900 border-amber-200';
    }
    if (s.includes('mild') || s.includes('குறை')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (s.includes('none') || s.includes('health') || s.includes('ஆரோக்கிய')) {
      return 'bg-teal-100 text-teal-800 border-teal-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.historyTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.historySubtitle}
          </p>
        </div>

        {/* Search bar */}
        {scans.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-emerald-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Scans Grid */}
      {filteredScans.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-stone-800 mb-1">
            {t.noScansYet}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto mb-6">
            {t.noScansSubtext}
          </p>
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <span>Scan Plant Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="group bg-white rounded-3xl border border-stone-200 hover:border-emerald-500 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image header */}
                <div className="relative aspect-4/3 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={scan.imageUrl}
                    alt={scan.condition}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-xs ${getSeverityBadge(
                        scan.severity
                      )}`}
                    >
                      {scan.severity}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                    {scan.confidence}% Conf.
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h4 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1 mb-2">
                    {scan.condition}
                  </h4>

                  {scan.observations && scan.observations.length > 0 && (
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {scan.observations[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{scan.createdAtFormatted || 'Recent'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(e, scan.id)}
                    disabled={deletingId === scan.id}
                    title={t.deleteScan}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
