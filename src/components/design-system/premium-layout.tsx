'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Home, 
  Target, 
  Calendar, 
  FileText, 
  Phone, 
  Calculator, 
  Wallet,
  PiggyBank,
  Bell,
  Search,
  Plus,
  Settings,
  LogOut,
  Gift,
  Users,
  X,
  Building2,
  Menu,
  Sun,
  Moon,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../theme-provider';
import { useTranslation } from '../language-provider';

interface PremiumLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

// Navigation sections
const navSections = [
  {
    title: 'Overview',
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard', badge: 'Live', badgeColor: 'green' as const },
    ]
  },
  {
    title: 'Sales',
    items: [
      { icon: Target, label: 'Leads', href: '/leads', count: 156 },
      { icon: Calendar, label: 'Appointments', href: '/appointments', count: 8 },
      { icon: FileText, label: 'Offers', href: '/offers', badge: '3 New', badgeColor: 'orange' as const },
    ]
  },
  {
    title: 'Finance',
    items: [
      { icon: Wallet, label: 'Commission', href: '/commission', amount: '€18.6K' },
      { icon: PiggyBank, label: 'Fidelity', href: '/fidelity', amount: '€2.4K' },
    ]
  },
  {
    title: 'Rewards',
    items: [
      { icon: Gift, label: 'Incentives', href: '/incentives', badge: '4 Active', badgeColor: 'purple' as const },
    ]
  },
  {
    title: 'Team',
    items: [
      { icon: Users, label: 'Network', href: '/team', count: 3 },
    ]
  },
  {
    title: 'Operations',
    items: [
      { icon: Phone, label: 'Call Center', href: '/call-center' },
      { icon: Calculator, label: 'Calculator', href: '/calculator' },
    ]
  },
];

// Bottom nav items for mobile
const bottomNavItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Target, label: 'Leads', href: '/leads' },
  { icon: Calculator, label: 'Calc', href: '/calculator' },
  { icon: Gift, label: 'Rewards', href: '/incentives' },
  { icon: Wallet, label: 'Comm', href: '/commission' },
];

// Quick actions for topbar
const quickActions = [
  { icon: Plus, label: 'New Lead', href: '/leads/new', color: 'accent' },
  { icon: Phone, label: 'Call', href: '/call-center', color: 'green' },
  { icon: FileText, label: 'Quote', href: '/offers/new', color: 'blue' },
];

// Theme Toggle Component
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-elevated hover:bg-bg-overlay transition-colors"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-text-secondary" />
      ) : (
        <Moon className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
}

// Language Toggle Component
function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { code: 'nl', label: 'NL', flag: '🇳🇱' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];
  
  const current = languages.find(l => l.code === language) || languages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated hover:bg-bg-overlay transition-colors text-sm font-medium"
      >
        <span>{current.flag}</span>
        <span className="text-text-primary">{current.label}</span>
        <ChevronDown className="w-3 h-3 text-text-muted" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-32 bg-bg-surface rounded-xl shadow-modal border border-border-strong py-1 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code as 'nl' | 'fr' | 'en'); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                  language === lang.code 
                    ? 'text-accent bg-accent-glow' 
                    : 'text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                <span>{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Search Modal
function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-bg-surface rounded-2xl shadow-modal border border-border-strong overflow-hidden animate-fade-in">
        <div className="flex items-center gap-4 p-4 border-b border-border">
          <Search className="w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search leads, contacts, quotes..."
            className="flex-1 bg-transparent text-text-primary text-base outline-none placeholder:text-text-muted"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs bg-bg-elevated rounded text-text-muted">ESC</kbd>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Quick Actions</p>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-elevated transition-colors"
                onClick={onClose}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  action.color === 'accent' ? 'bg-accent-glow text-accent' :
                  action.color === 'green' ? 'bg-success-bg text-success' :
                  'bg-blue-bg text-blue'
                }`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-text-primary font-medium">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-text-muted ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PremiumLayout({ children, user }: PremiumLayoutProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowMobileMenu(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-bg-base pb-safe">
      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-bg-surface border-r border-border overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-semibold text-text-primary text-lg">SmartSN</span>
              </div>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 text-text-primary hover:bg-bg-elevated rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <div className="px-3 mb-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    {section.title}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive 
                              ? 'bg-accent-glow text-accent' 
                              : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              item.badgeColor === 'green' ? 'bg-success-bg text-success' :
                              item.badgeColor === 'orange' ? 'bg-accent-glow text-accent' :
                              item.badgeColor === 'purple' ? 'bg-purple-bg text-purple' :
                              'bg-bg-elevated text-text-secondary'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          {item.count && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-bg-elevated text-text-muted rounded-full">
                              {item.count}
                            </span>
                          )}
                          {item.amount && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-success-bg text-success rounded-full">
                              {item.amount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sidebar fixed left-0 top-0 bottom-0 z-30 hidden lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-accent">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-text-primary text-lg">SmartSN</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="sidebar-section">{section.title}</div>
              <div className="px-2">
                {section.items.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`sidebar-item ${isActive ? 'sidebar-item--active' : ''}`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-text-muted'}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`sidebar-badge ${
                          item.badgeColor === 'green' ? 'sidebar-badge--green' : ''
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="sidebar-badge--neutral">{item.count}</span>
                      )}
                      {item.amount && (
                        <span className="text-success text-xs font-semibold">{item.amount}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Topbar - Desktop */}
      <header className="topbar fixed top-0 right-0 left-0 lg:left-[220px] z-20">
        {/* Mobile: Menu button + Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-2 text-text-primary hover:bg-bg-elevated rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
        </div>

        {/* Search - Desktop */}
        <div className="hidden lg:block flex-1 max-w-md">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 bg-bg-elevated border border-border rounded-lg text-left hover:border-border-strong transition-colors"
          >
            <Search className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted text-sm flex-1">Search leads, contacts...</span>
            <kbd className="px-2 py-0.5 text-xs bg-bg-surface border border-border rounded text-text-muted">⌘K</kbd>
          </button>
        </div>

        {/* Mobile: Search button */}
        <button
          onClick={() => setShowSearch(true)}
          className="lg:hidden p-2 text-text-primary hover:bg-bg-elevated rounded-lg"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Quick Actions - Desktop */}
          <div className="hidden xl:flex items-center gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-secondary bg-bg-elevated hover:bg-bg-overlay rounded-lg transition-colors"
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden 2xl:inline">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-border hidden xl:block" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Toggle */}
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-text-primary">{user?.name || 'User'}</span>
                <span className="text-xs text-text-muted">Consultant</span>
              </div>
              <ChevronDown className="hidden lg:block w-4 h-4 text-text-muted" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-bg-surface rounded-xl shadow-modal border border-border-strong py-2 z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-text-primary">{user?.name || 'User'}</p>
                  <p className="text-sm text-text-muted">{user?.email || 'user@example.com'}</p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg-elevated transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <div className="border-t border-border my-2" />
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-4 py-2 text-danger hover:bg-danger-bg transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 lg:pt-14 lg:ml-[220px] min-h-screen">
        {/* Header spacing for fixed topbar */}
        <div className="h-4" />
        
        {/* Page Content */}
        <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          {children}
        </div>
        
        {/* Bottom spacing for mobile tab bar */}
        <div className="h-16 lg:hidden" />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="tab-bar lg:hidden">
        {bottomNavItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`tab-item ${isActive ? 'tab-item--active' : ''}`}
            >
              <item.icon className={`w-[22px] h-[22px] ${isActive ? 'text-accent' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
