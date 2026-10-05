import React from 'react';
import { Leaf, History, Sparkles, User as UserIcon, Globe, Cpu, LogOut } from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentTab: 'home' | 'history';
  setCurrentTab: (tab: 'home' | 'history') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenArchitecture,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand & Tagline */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                Phyto<span className="text-emerald-600">Scan</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider uppercase">
                AGRIMIND
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'history'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t.navHistory}</span>
            </button>
          </nav>

          {/* Architecture Details Modal Trigger */}
          <button
            onClick={onOpenArchitecture}
            title={t.pipelineBadge}
            className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-stone-100 rounded-xl transition-colors hidden md:flex items-center gap-1.5 text-xs font-medium"
          >
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>{t.navArchitecture}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-stone-100 rounded-xl px-2.5 py-1.5 border border-stone-200 hover:border-emerald-300 transition-colors shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-stone-500 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value as Language;
                setLanguage(newLang);
                try {
                  localStorage.setItem('phytoscan_language', newLang);
                } catch (err) {
                  console.warn('Failed to save language in localStorage', err);
                }
              }}
              aria-label="Language selection"
              className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ml">മലയാളം</option>
            </select>
          </div>

          {/* Auth State Button */}
          {currentUser && !currentUser.isAnonymous ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-stone-200">
              <span
                title={currentUser.email || 'User'}
                className="hidden lg:inline-block max-w-[110px] truncate text-xs font-medium text-stone-600"
              >
                {currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={onSignOut}
                title={t.signOut}
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-800 bg-stone-100 hover:bg-emerald-50 rounded-xl border border-stone-200 transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">
                {currentUser?.isAnonymous ? t.guestUser : t.signIn}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
