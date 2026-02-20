'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Users, 
  Phone, 
  DollarSign,
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  PhoneCall,
  FileText,
  Plus,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Types for API responses
interface StatsData {
  leads: { total: number; new: number; trend: string };
  calls: { total: number; today: number; trend: string };
  offers: { total: number; pending: number; trend: string };
  commission: { month: number; year: number; trend: string };
}

interface ActivityItem {
  id: string;
  type: 'call' | 'offer' | 'lead' | 'sale' | 'followup';
  title: string;
  time: string;
  status: 'success' | 'pending' | 'new' | 'warning';
}

// Mock data for appointments and topLeads (kept as fallback)
const upcomingAppointments = [
  { id: 1, company: 'De Smet Group', contact: 'Luc De Smet', time: '14:00', type: 'phone' },
  { id: 2, company: 'Claes Solutions', contact: 'Anna Claes', time: '15:30', type: 'visit' },
  { id: 3, company: 'Wouters NV', contact: 'Peter Wouters', time: 'Tomorrow 10:00', type: 'phone' },
];

const topLeads = [
  { id: 1, company: 'Tech Solutions BV', contact: 'Jan Janssen', status: 'quoted', value: '€2,450' },
  { id: 2, company: 'Willems Group', contact: 'Sarah Willems', status: 'contacted', value: '€1,890' },
  { id: 3, company: 'Mertens NV', contact: 'Jan Mertens', status: 'new', value: '€3,200' },
  { id: 4, company: 'Fashion Store', contact: 'Lisa Dubois', status: 'offer_sent', value: '€1,450' },
];

// Skeleton component for stat cards
function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-bg-elevated animate-pulse" />
        <div className="w-12 h-4 bg-bg-elevated animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        <div className="w-16 h-4 bg-bg-elevated animate-pulse rounded" />
        <div className="w-24 h-8 bg-bg-elevated animate-pulse rounded" />
        <div className="w-20 h-3 bg-bg-elevated animate-pulse rounded" />
      </div>
    </div>
  );
}

// Skeleton component for activity items
function ActivityItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl">
      <div className="w-10 h-10 rounded-xl bg-bg-elevated animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="w-48 h-4 bg-bg-elevated animate-pulse rounded" />
        <div className="w-24 h-3 bg-bg-elevated animate-pulse rounded" />
      </div>
      <div className="w-16 h-6 bg-bg-elevated animate-pulse rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [greeting, setGreeting] = useState('Good morning');
  const [mounted, setMounted] = useState(false);
  
  // Data states
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  // Loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  
  // Error states
  const [statsError, setStatsError] = useState<string | null>(null);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Fetch stats from API
  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStatsError('Failed to load statistics');
      } finally {
        setStatsLoading(false);
      }
    }

    if (mounted) {
      fetchStats();
    }
  }, [mounted]);

  // Fetch activity from API
  useEffect(() => {
    async function fetchActivity() {
      try {
        setActivityLoading(true);
        setActivityError(null);
        const response = await fetch('/api/activity');
        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }
        const data = await response.json();
        setActivities(data.activities || []);
      } catch (error) {
        console.error('Error fetching activity:', error);
        setActivityError('Failed to load recent activity');
      } finally {
        setActivityLoading(false);
      }
    }

    if (mounted) {
      fetchActivity();
    }
  }, [mounted]);

  // Format time for display
  function formatTime(timeString: string): string {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  // Get user name from session
  const userName = session?.user?.name || 'User';

  // Build stats array from API data
  const statsArray = stats ? [
    { 
      label: 'Total Leads', 
      value: stats.leads.total.toString(), 
      icon: Users, 
      iconColor: 'blue' as const, 
      badge: stats.leads.new.toString(), 
      badgeVariant: 'positive' as const,
      subtext: 'New this week'
    },
    { 
      label: 'Active Offers', 
      value: stats.offers.pending.toString(), 
      icon: FileText, 
      iconColor: 'purple' as const, 
      badge: stats.offers.trend, 
      badgeVariant: 'positive' as const,
      subtext: 'Pending response'
    },
    { 
      label: 'This Month', 
      value: `€${stats.commission.month.toFixed(2)}`, 
      icon: DollarSign, 
      iconColor: 'green' as const, 
      badge: stats.commission.trend, 
      badgeVariant: 'positive' as const,
      subtext: 'Passive income'
    },
    { 
      label: 'Conversion Rate', 
      value: '24.5%', 
      icon: TrendingUp, 
      iconColor: 'teal' as const, 
      badge: '2.1%', 
      badgeVariant: 'positive' as const,
      subtext: 'vs last month'
    },
  ] : [];

  if (!mounted) return null;

  return (
    <PremiumLayout user={{ name: userName }}>
      {/* Hero Banner */}
      <div className="hero-banner mb-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-text-secondary">Live Dashboard</span>
          </div>
          <h1 className="h1 text-white mb-2">{greeting}, {userName}! 👋</h1>
          <p className="body-md text-text-secondary">
            You&apos;ve earned <span className="text-accent font-semibold">€{stats?.commission.month.toFixed(2) || '0.00'}</span> in passive commissions this month
          </p>
        </div>
      </div>

      {/* Error Alerts */}
      {statsError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{statsError}</AlertDescription>
        </Alert>
      )}
      {activityError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{activityError}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statsArray.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              badge={stat.badge}
              badgeVariant={stat.badgeVariant}
              subtext={stat.subtext}
            />
          ))
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Link href="#" className="text-sm text-accent hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLoading ? (
                <>
                  <ActivityItemSkeleton />
                  <ActivityItemSkeleton />
                  <ActivityItemSkeleton />
                  <ActivityItemSkeleton />
                  <ActivityItemSkeleton />
                </>
              ) : activities.length === 0 ? (
                <p className="text-text-muted text-center py-8">No recent activity</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-elevated transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-success-bg text-success' :
                      activity.status === 'pending' ? 'bg-accent-glow text-accent' :
                      activity.status === 'new' ? 'bg-blue-bg text-blue' :
                      'bg-warning-bg text-warning'
                    }`}>
                      {activity.type === 'call' && <PhoneCall className="w-5 h-5" />}
                      {activity.type === 'offer' && <FileText className="w-5 h-5" />}
                      {activity.type === 'lead' && <Plus className="w-5 h-5" />}
                      {activity.type === 'sale' && <DollarSign className="w-5 h-5" />}
                      {activity.type === 'followup' && <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{activity.title}</p>
                      <p className="text-text-muted text-sm">{formatTime(activity.time)}</p>
                    </div>
                    <Badge 
                      variant={
                        activity.status === 'success' ? 'green' :
                        activity.status === 'pending' ? 'orange' :
                        activity.status === 'new' ? 'blue' :
                        'neutral'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <Calendar className="w-5 h-5 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-3 p-3 bg-bg-elevated rounded-xl">
                    <div className="w-12 h-12 bg-accent-glow rounded-xl flex items-center justify-center text-accent font-semibold text-sm">
                      {apt.time.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium truncate">{apt.company}</p>
                      <p className="text-text-muted text-sm">{apt.contact}</p>
                    </div>
                    <Badge variant={apt.type === 'visit' ? 'purple' : 'blue'}>
                      {apt.type}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link href="/appointments">
                <Button variant="secondary" className="w-full mt-4">
                  View Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Top Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Top Leads</CardTitle>
              <Target className="w-5 h-5 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
                    <div>
                      <p className="text-text-primary font-medium">{lead.company}</p>
                      <p className="text-text-muted text-sm">{lead.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-primary font-semibold">{lead.value}</p>
                      <Badge 
                        variant={
                          lead.status === 'quoted' ? 'purple' :
                          lead.status === 'contacted' ? 'orange' :
                          lead.status === 'offer_sent' ? 'green' :
                          'blue'
                        }
                        className="text-xs"
                      >
                        {lead.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/leads">
                <Button variant="ghost" className="w-full mt-4">
                  View All Leads
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 flex flex-col gap-3 z-30">
        <Link href="/leads/new">
          <Button className="shadow-accent">
            <Plus className="w-5 h-5 mr-2" />
            New Lead
          </Button>
        </Link>
      </div>
    </PremiumLayout>
  );
}
