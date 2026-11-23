import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import type { LanguageOption } from '../../types/i18n';

export const LanguageSwitcher: FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLanguageSelect = (lang: LanguageOption) => {
    i18n.changeLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-start" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('nav.languageSelector')}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-900/80 border border-slate-800 rounded-lg hover:text-white hover:border-slate-700 hover:bg-slate-800/80 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer"
      >
        <Globe className="w-4 h-4 text-cyan-400" aria-hidden="true" />
        {activeLanguage.flag && (
          <span className="text-base leading-none" aria-hidden="true">
            {activeLanguage.flag}
          </span>
        )}
        <span className="hidden sm:inline">{activeLanguage.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('nav.languageSelector')}
          className="absolute end-0 mt-2 w-44 py-1 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/50 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === activeLanguage.code;
            return (
              <li
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleLanguageSelect(lang)}
                className={`flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {lang.flag && (
                    <span className="text-base leading-none" aria-hidden="true">
                      {lang.flag}
                    </span>
                  )}
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-cyan-400 ms-2" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
