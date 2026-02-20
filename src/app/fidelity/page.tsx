'use client';

import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Users,
  TrendingUp,
  ArrowLeft,
  Wifi,
  Smartphone,
  Info,
  Wallet,
  Clock
} from 'lucide-react';
import Link from 'next/link';

// User data
const USER_DATA = {
  rank: 'PMC' as const,
  totalCommissions: 8900,
  personalFidelity: {
    internet: { count: 45, monthly: 15.75 },
    mobile: { count: 67, monthly: 45.50 },
    total: { count: 112, monthly: 61.25 },
  },
  uplineFidelity: {
    level1: { count: 89, monthly: 22.50 },
    level2: { count: 67, monthly: 10.80 },
    level3: { count: 45, monthly: 7.20 },
    level4: { count: 23, monthly: 3.60 },
    level5: { count: 12, monthly: 1.92 },
    level6: { count: 8, monthly: 1.44 },
    level7: { count: 5, monthly: 1.50 },
    total: { count: 249, monthly: 48.96 },
  },
};

// Fidelity rates
const FIDELITY_RATES = {
  internet: { personal: 0.35, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
  mobile: {
    child: { personal: 0.25, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
    small: { personal: 0.50, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
    medium: { personal: 1.00, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
    large: { personal: 1.25, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
    unlimited: { personal: 1.50, upline: [0.10, 0.04, 0.04, 0.04, 0.04, 0.04, 0.05] },
  },
  tv: { personal: 0.20, upline: [0.05, 0.02, 0.02, 0.02, 0.02, 0.02, 0.05] },
};

export default function FidelityPage() {
  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/commissions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1">Monthly Fidelity</h1>
            <p className="body-md text-text-secondary">Passive income from your active contracts</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-blue/30 bg-blue-bg/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-bg rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Total Monthly Fidelity</p>
                <p className="text-3xl font-bold text-blue">
                  €{(USER_DATA.personalFidelity.total.monthly + USER_DATA.uplineFidelity.total.monthly).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Your contracts</span>
              <span className="font-semibold text-blue">€{USER_DATA.personalFidelity.total.monthly.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-text-secondary">Team contracts</span>
              <span className="font-semibold text-blue">€{USER_DATA.uplineFidelity.total.monthly.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-glow rounded-xl flex items-center justify-center">
                <Wifi className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Internet Services</p>
                <p className="text-3xl font-bold text-accent">€{USER_DATA.personalFidelity.internet.monthly.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              {USER_DATA.personalFidelity.internet.count} active contracts
            </p>
            <p className="text-xs text-text-muted mt-1">
              €0.35 per contract/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-success-bg rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-muted">Mobile Services</p>
                <p className="text-3xl font-bold text-success">€{USER_DATA.personalFidelity.mobile.monthly.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              {USER_DATA.personalFidelity.mobile.count} active contracts
            </p>
            <p className="text-xs text-text-muted mt-1">
              €0.25-€1.50 per contract/month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Fidelity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Personal Fidelity</CardTitle>
                  <p className="text-sm text-text-muted">Your direct contract earnings</p>
                </div>
              </div>
              <Badge variant="orange" className="text-lg">€{USER_DATA.personalFidelity.total.monthly.toFixed(2)}/mo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Fidelity Rates Table */}
            <div className="overflow-hidden rounded-xl border border-border mb-6">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="text-left p-3 text-text-secondary font-medium">Service</th>
                    <th className="text-right p-3 text-text-secondary font-medium">Rate/Month</th>
                    <th className="text-right p-3 text-text-secondary font-medium">Your Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-accent" />
                        <span>Internet</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€0.35</td>
                    <td className="p-3 text-right text-accent font-bold">€{USER_DATA.personalFidelity.internet.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Mobile - Child</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€0.25</td>
                    <td className="p-3 text-right text-success">—</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Mobile - Small</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€0.50</td>
                    <td className="p-3 text-right text-success">—</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Mobile - Medium</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€1.00</td>
                    <td className="p-3 text-right text-success">—</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Mobile - Large</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€1.25</td>
                    <td className="p-3 text-right text-success">—</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Mobile - Unlimited</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-semibold">€1.50</td>
                    <td className="p-3 text-right text-success font-bold">€{USER_DATA.personalFidelity.mobile.monthly.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-bg-elevated">
                  <tr>
                    <td colSpan={2} className="p-3 text-right font-semibold">Total Monthly</td>
                    <td className="p-3 text-right text-lg font-bold text-accent">€{USER_DATA.personalFidelity.total.monthly.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-bg-elevated rounded-xl">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-text-muted mt-0.5" />
                <p className="text-xs text-text-muted">
                  Fidelity is paid monthly for each active contract. It continues as long as the customer remains subscribed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upline Fidelity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <CardTitle>Upline Fidelity</CardTitle>
                  <p className="text-sm text-text-muted">Earnings from your team</p>
                </div>
              </div>
              <Badge variant="purple" className="text-lg">€{USER_DATA.uplineFidelity.total.monthly.toFixed(2)}/mo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Upline Levels Table */}
            <div className="overflow-hidden rounded-xl border border-border mb-6">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="text-left p-3 text-text-secondary font-medium">Level</th>
                    <th className="text-right p-3 text-text-secondary font-medium">Contracts</th>
                    <th className="text-right p-3 text-text-secondary font-medium">Rate</th>
                    <th className="text-right p-3 text-text-secondary font-medium">Your Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-accent-glow flex items-center justify-center text-xs text-accent font-bold">1</span>
                        <span>Niveau 1</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level1.count}</td>
                    <td className="p-3 text-right font-semibold">€0.10</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level1.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">2</span>
                        <span>Niveau 2</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level2.count}</td>
                    <td className="p-3 text-right font-semibold">€0.04</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level2.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">3</span>
                        <span>Niveau 3</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level3.count}</td>
                    <td className="p-3 text-right font-semibold">€0.04</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level3.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">4</span>
                        <span>Niveau 4</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level4.count}</td>
                    <td className="p-3 text-right font-semibold">€0.04</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level4.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">5</span>
                        <span>Niveau 5</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level5.count}</td>
                    <td className="p-3 text-right font-semibold">€0.04</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level5.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">6</span>
                        <span>Niveau 6</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level6.count}</td>
                    <td className="p-3 text-right font-semibold">€0.04</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level6.monthly.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted font-bold">7</span>
                        <span>Niveau 7</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">{USER_DATA.uplineFidelity.level7.count}</td>
                    <td className="p-3 text-right font-semibold">€0.05</td>
                    <td className="p-3 text-right font-bold text-purple">€{USER_DATA.uplineFidelity.level7.monthly.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-bg-elevated">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">Total Upline</td>
                    <td className="p-3 text-right text-lg font-bold text-purple">€{USER_DATA.uplineFidelity.total.monthly.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-purple-bg rounded-xl">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-purple mt-0.5" />
                <p className="text-xs text-text-secondary">
                  Upline fidelity pays €0.10 for Niveau 1 (sponsor), €0.04 for Niveaus 2-6, and €0.05 for Niveau 7 per active contract.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Fidelity Works */}
      <Card className="mt-6 bg-accent-glow border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-glow rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-2">How Fidelity Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-text-primary mb-1">Personal Fidelity</p>
                  <p className="text-text-secondary">
                    Earn monthly for every active contract you sell directly. Internet pays €0.35/month, mobile rates vary by plan.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Upline Fidelity</p>
                  <p className="text-text-secondary">
                    Earn from contracts sold by consultants in your downline. Rates vary by niveau, from €0.10 (Niveau 1) to €0.05 (Niveau 7).
                  </p>
                </div>
                <div>
                  <p className="font-medium text-text-primary mb-1">Clawback Protection</p>
                  <p className="text-text-secondary">
                    Fidelity stops if a contract cancels. Contracts under 1 month pay 0% commission, 1-6 months pay 25% clawback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PremiumLayout>
  );
}
