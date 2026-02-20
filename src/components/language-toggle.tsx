'use client';

import { useTranslation } from './language-provider';
import type { Language } from '@/lib/i18n/translations';

const languages: { code: Language; label: string }[] = [
  { code: 'nl', label: 'NL' },
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 gap-1 border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center justify-center px-2 py-1.5 rounded-md text-sm font-medium transition-all ${
            language === lang.code
              ? 'bg-[var(--bg-primary)] text-orange-500 shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
          title={lang.label}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

// Compact version for smaller headers
export function LanguageToggleCompact() {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="flex items-center bg-[var(--bg-tertiary)] rounded-full p-0.5 border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all ${
            language === lang.code
              ? 'bg-[var(--bg-primary)] text-orange-500 shadow-sm'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
          }`}
          title={lang.label}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
