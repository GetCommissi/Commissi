'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Calculator, 
  FileText, 
  Gift, 
  Euro, 
  Users2, 
  BarChart3,
  Calendar,
  LogOut,
  Crown,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  variant?: 'dark' | 'light' | 'gradient';
  user?: {
    initials?: string;
    name?: string;
    rank?: string;
  };
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Lead Management', href: '/leads' },
  { icon: Phone, label: 'Call Logging', href: '/call-center' },
  { icon: Calendar, label: 'Afspraken', href: '/appointments' },
  { icon: Calculator, label: 'Prijs Calculator', href: '/calculator' },
  { icon: FileText, label: 'Offertes', href: '/offers' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: Gift, label: 'Incentives', href: '/incentives', badge: 'NEW' },
  { icon: Euro, label: 'Mijn Commissie', href: '/commission' },
  { icon: Users2, label: 'Team Management', href: '/team' },
  { icon: BarChart3, label: 'Rapporten', href: '/reports' },
];

export function GradientSidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const userInitials = user?.initials || '??';
  const userName = user?.name || 'Business Consultant';
  const userRank = user?.rank || 'BC';

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-white">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl">Commissi</h1>
            <p className="text-xs text-teal-100">Commission Platform</p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {userInitials}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{userName}</p>
              <p className="text-xs text-gray-500">Rank: {userRank}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">ASP Doel</span>
              <span className="font-medium">0 / 100</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-teal-50 text-teal-600 border border-teal-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-100' : 'bg-gray-100'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
        <p className="text-xs text-gray-400 mb-2">Deze Maand</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">€0</p>
            <p className="text-xs text-gray-400">Commissie</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">0</p>
            <p className="text-xs text-gray-400">Sales</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors w-full rounded-xl hover:bg-gray-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}
