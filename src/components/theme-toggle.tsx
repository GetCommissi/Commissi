'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const themeContext = useTheme();
  
  // Fallback als theme niet beschikbaar is
  const theme = themeContext?.theme || 'light';
  const setTheme = themeContext?.setTheme || (() => {});

  return (
    <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-1 gap-1 border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'light'
            ? 'bg-[var(--bg-primary)] text-orange-500 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
        }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'dark'
            ? 'bg-[var(--bg-primary)] text-purple-500 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
        }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-8" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-[var(--bg-primary)] text-blue-500 shadow-sm'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
        }`}
        title="System"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}

// Compact version for smaller headers
export function ThemeToggleCompact() {
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';
  const setTheme = themeContext?.setTheme || (() => {});
  const resolvedTheme = themeContext?.resolvedTheme || 'light';

  const toggleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const icon = resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />;
  const label = theme === 'system' ? 'Auto' : resolvedTheme === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-all border border-[rgba(0,0,0,0.05)] dark:border-[rgba(255,255,255,0.05)]"
      title={`Theme: ${label}`}
    >
      {icon}
    </button>
  );
}
