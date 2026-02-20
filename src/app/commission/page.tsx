'use client';

import { useState, useMemo } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Users,
  TrendingUp,
  ArrowLeft,
  Filter,
  Download,
  Wallet,
  Clock,
  AlertTriangle,
  ArrowRight,
  Info,
  Edit3,
  X,
  CheckCircle2,
  Eye,
  Save,
  Trash2,
  Smartphone,
  Wifi,
  Tv,
  ZapOff
} from 'lucide-react';
import Link from 'next/link';
import { calculateItemASP } from '@/lib/commission-engine';

// User data
const USER_DATA = {
  rank: 'PMC' as const,
  totalCommissions: 8900,
  availableForPayout: 2450,
  pending: 1250,
  clawbackPending: 800,
  personalFidelity: {
    internet: { count: 45, monthly: 15.75 },
    mobile: { count: 67, monthly: 45.50 },
    total: { count: 112, monthly: 61.25 },
  },
  uplineFidelity: {
    total: { count: 249, monthly: 48.96 },
  },
};

// Commission breakdown item
interface CommissionItem {
  product: string;
  type: 'internet' | 'mobile' | 'tv';
  base: number;
  portability: number;
  convergence: number;
  total: number;
  aspPoints: number;
  editable?: boolean;
}

// Sale data with full breakdown
interface Sale {
  id: string;
  customer: string;
  date: string;
  status: 'active' | 'cancelled' | 'pending';
  cancelledDate?: string;
  monthsActive: number;
  commissionItems: CommissionItem[];
  totalCommission: number;
  clawbackAmount: number;
  netCommission: number;
  totalASP: number;
}

// Initial sales data with detailed breakdown
const INITIAL_SALES_DATA: Sale[] = [
  {
    id: 'S-001',
    customer: 'Jan Peeters',
    date: '2025-01-15',
    status: 'active',
    monthsActive: 1,
    commissionItems: [
      { product: 'Internet Zen', type: 'internet', base: 20, portability: 0, convergence: 15, total: 35, aspPoints: 1.0 },
      { product: 'GSM 1 - Medium', type: 'mobile', base: 40, portability: 20, convergence: 12, total: 72, aspPoints: 1.0 },
    ],
    totalCommission: 107,
    clawbackAmount: 26.75,
    netCommission: 80.25,
    totalASP: 2.0,
  },
  {
    id: 'S-002',
    customer: 'Marie Dubois',
    date: '2025-01-12',
    status: 'active',
    monthsActive: 1,
    commissionItems: [
      { product: 'GSM 1 - Large', type: 'mobile', base: 55, portability: 20, convergence: 0, total: 75, aspPoints: 1.25 },
    ],
    totalCommission: 75,
    clawbackAmount: 18.75,
    netCommission: 56.25,
  },
  {
    id: 'S-003',
    customer: 'Luc Vermeulen',
    date: '2025-01-10',
    status: 'active',
    monthsActive: 1,
    commissionItems: [
      { product: 'Internet Giga', type: 'internet', base: 20, portability: 0, convergence: 15, total: 35, aspPoints: 1.0 },
      { product: 'GSM 1 - Unlimited', type: 'mobile', base: 65, portability: 20, convergence: 12, total: 97, aspPoints: 1.5 },
      { product: 'TV+', type: 'tv', base: 10, portability: 0, convergence: 0, total: 10, aspPoints: 1.0 },
    ],
    totalCommission: 142,
    clawbackAmount: 35.50,
    netCommission: 106.50,
    totalASP: 3.5,
  },
  {
    id: 'S-004',
    customer: 'Ann Van den Berg',
    date: '2025-01-08',
    status: 'active',
    monthsActive: 1,
    commissionItems: [
      { product: 'GSM 1 - Medium', type: 'mobile', base: 40, portability: 0, convergence: 0, total: 40, aspPoints: 1.0 },
    ],
    totalCommission: 40,
    clawbackAmount: 10,
    netCommission: 30,
    totalASP: 1.0,
  },
  {
    id: 'S-005',
    customer: 'Pieter Janssens',
    date: '2024-12-20',
    status: 'active',
    monthsActive: 2,
    commissionItems: [
      { product: 'Internet Start', type: 'internet', base: 20, portability: 0, convergence: 15, total: 35, aspPoints: 1.0 },
      { product: 'GSM 1 - Small', type: 'mobile', base: 15, portability: 0, convergence: 0, total: 15, aspPoints: 0.5 },
    ],
    totalCommission: 50,
    clawbackAmount: 12.50,
    netCommission: 37.50,
    totalASP: 1.5,
  },
  {
    id: 'S-006',
    customer: 'Sofie Willems',
    date: '2024-08-15',
    status: 'active',
    monthsActive: 6,
    commissionItems: [
      { product: 'GSM 1 - Large', type: 'mobile', base: 55, portability: 20, convergence: 0, total: 75, aspPoints: 1.25 },
    ],
    totalCommission: 75,
    clawbackAmount: 18.75,
    netCommission: 56.25,
    totalASP: 1.25,
  },
  {
    id: 'S-007',
    customer: 'Bart De Smet',
    date: '2025-01-05',
    status: 'cancelled',
    cancelledDate: '2025-01-20',
    monthsActive: 0,
    commissionItems: [
      { product: 'Internet Zen', type: 'internet', base: 20, portability: 0, convergence: 15, total: 35, aspPoints: 1.0 },
      { product: 'TV+', type: 'tv', base: 10, portability: 0, convergence: 0, total: 10, aspPoints: 1.0 },
    ],
    totalCommission: 45,
    clawbackAmount: 45,
    netCommission: 0,
    totalASP: 2.0,
  },
];

// Upline commission data
const UPLINE_DATA = [
  { level: 1, consultant: 'Thomas Peeters', sales: 12, commission: 156, rate: '10%' },
  { level: 2, consultant: 'Lisa Janssens', sales: 8, commission: 52, rate: '5%' },
  { level: 3, consultant: 'Mark Willems', sales: 6, commission: 31, rate: '3%' },
  { level: 4, consultant: 'Emma Dubois', sales: 4, commission: 18, rate: '3%' },
  { level: 5, consultant: 'David Peeters', sales: 3, commission: 9, rate: '2%' },
  { level: 6, consultant: 'Nina Vermeulen', sales: 2, commission: 4, rate: '1%' },
  { level: 7, consultant: 'Kobe Janssens', sales: 1, commission: 2, rate: '1%' },
];

// Calculate clawback based on months active
function calculateClawback(totalCommission: number, monthsActive: number): { keep: number; clawback: number; percentage: number } {
  if (monthsActive < 1) {
    return { keep: 0, clawback: totalCommission, percentage: 0 };
  } else if (monthsActive < 6) {
    const keep = totalCommission * 0.25;
    return { keep, clawback: totalCommission - keep, percentage: 25 };
  } else {
    const keep = totalCommission * 0.75;
    return { keep, clawback: totalCommission - keep, percentage: 75 };
  }
}

export default function CommissionPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'cancelled'>('all');
  const [salesData, setSalesData] = useState<Sale[]>(INITIAL_SALES_DATA);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<CommissionItem[]>([]);

  // Calculate totals excluding clawback
  const { 
    totalEarned, 
    totalClawback, 
    totalNet, 
    activeSales, 
    cancelledSales,
    pendingPayout,
    availablePayout,
    totalASP,
    activeASP
  } = useMemo(() => {
    const active = salesData.filter(s => s.status === 'active');
    const cancelled = salesData.filter(s => s.status === 'cancelled');
    
    const earned = active.reduce((sum, s) => sum + s.totalCommission, 0);
    const clawback = cancelled.reduce((sum, s) => sum + s.totalCommission, 0) + 
                     active.reduce((sum, s) => sum + s.clawbackAmount, 0);
    
    // Net = what you actually keep after clawback rules
    const netActive = active.reduce((sum, s) => sum + s.netCommission, 0);
    const net = netActive; // Cancelled sales give 0
    
    // Pending = sales < 1 month (0% payout yet)
    const pending = active
      .filter(s => s.monthsActive < 1)
      .reduce((sum, s) => sum + s.totalCommission, 0);
    
    // Available = sales eligible for payout
    const available = active
      .filter(s => s.monthsActive >= 1)
      .reduce((sum, s) => sum + s.netCommission, 0);
    
    // ASP Points calculation
    const totalASPPoints = salesData.reduce((sum, s) => sum + s.totalASP, 0);
    const activeASPPoints = active.reduce((sum, s) => sum + s.totalASP, 0);
    
    return {
      totalEarned: earned,
      totalClawback: clawback,
      totalNet: net,
      activeSales: active.length,
      cancelledSales: cancelled.length,
      pendingPayout: pending,
      availablePayout: available,
      totalASP: totalASPPoints,
      activeASP: activeASPPoints,
    };
  }, [salesData]);

  const filteredSales = salesData.filter(sale => 
    filterStatus === 'all' ? true : sale.status === filterStatus
  );

  const handleSaleClick = (sale: Sale) => {
    setSelectedSale(sale);
    setEditedItems([...sale.commissionItems]);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setSelectedSale(null);
    setIsEditing(false);
  };

  const handleEditItem = (index: number, field: keyof CommissionItem, value: number) => {
    const updated = [...editedItems];
    updated[index] = { ...updated[index], [field]: value };
    // Recalculate total
    updated[index].total = updated[index].base + updated[index].portability + updated[index].convergence;
    setEditedItems(updated);
  };

  const handleSaveEdit = () => {
    if (!selectedSale) return;
    
    const newTotal = editedItems.reduce((sum, item) => sum + item.total, 0);
    const clawback = calculateClawback(newTotal, selectedSale.monthsActive);
    
    const updatedSale: Sale = {
      ...selectedSale,
      commissionItems: editedItems,
      totalCommission: newTotal,
      clawbackAmount: clawback.clawback,
      netCommission: selectedSale.status === 'cancelled' ? 0 : clawback.keep,
    };
    
    setSalesData(prev => prev.map(s => s.id === selectedSale.id ? updatedSale : s));
    setSelectedSale(updatedSale);
    setIsEditing(false);
  };

  const handleCancelSale = (saleId: string) => {
    setSalesData(prev => prev.map(s => {
      if (s.id === saleId) {
        return {
          ...s,
          status: 'cancelled',
          cancelledDate: new Date().toISOString().split('T')[0],
          netCommission: 0,
          clawbackAmount: s.totalCommission,
        };
      }
      return s;
    }));
    if (selectedSale?.id === saleId) {
      setSelectedSale(null);
    }
  };

  const handleReactivateSale = (saleId: string) => {
    setSalesData(prev => prev.map(s => {
      if (s.id === saleId) {
        const clawback = calculateClawback(s.totalCommission, s.monthsActive);
        return {
          ...s,
          status: 'active',
          cancelledDate: undefined,
          netCommission: clawback.keep,
          clawbackAmount: clawback.clawback,
        };
      }
      return s;
    }));
    if (selectedSale?.id === saleId) {
      setSelectedSale(null);
    }
  };

  const getClawbackBadge = (months: number, status: string) => {
    if (status === 'cancelled') {
      return <Badge variant="danger">100% Clawback</Badge>;
    }
    if (months < 1) {
      return <Badge variant="neutral">0% Paid (Pending)</Badge>;
    } else if (months < 6) {
      return <Badge variant="warning">25% Paid</Badge>;
    } else {
      return <Badge variant="green">75% Paid</Badge>;
    }
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="h1">Commissions</h1>
            <p className="body-md text-text-secondary">Track your earnings and team performance</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-success/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Available</p>
                <p className="text-2xl font-bold text-success">€{availablePayout.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted">Ready for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Pending</p>
                <p className="text-2xl font-bold text-accent">€{pendingPayout.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted">Awaiting activation</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-danger-bg rounded-xl flex items-center justify-center">
                <ZapOff className="w-5 h-5 text-danger" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Clawback</p>
                <p className="text-2xl font-bold text-danger">-€{totalClawback.toFixed(0)}</p>
              </div>
            </div>
            <p className="text-xs text-text-muted">Deducted from earnings</p>
          </CardContent>
        </Card>

        <Link href="/incentives">
          <Card className="border-purple/30 hover:border-purple/50 transition-colors cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <p className="text-xs text-purple uppercase tracking-wider">ASP Points Q1</p>
                  <p className="text-2xl font-bold text-purple">{activeASP.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-purple">
                <span>View Incentives</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sales History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Sales History</CardTitle>
                    <p className="text-sm text-text-muted">
                      {activeSales} active • {cancelledSales} cancelled • Click row to view details
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                {(['all', 'active', 'cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-accent text-white'
                        : 'bg-bg-elevated text-text-secondary hover:bg-bg-overlay'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    <span className="ml-1.5 opacity-70">
                      ({status === 'all' ? salesData.length : salesData.filter(s => s.status === status).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Sales Table */}
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-bg-elevated">
                    <tr>
                      <th className="text-left p-3 text-text-secondary font-medium">Customer</th>
                      <th className="text-left p-3 text-text-secondary font-medium">Products</th>
                      <th className="text-center p-3 text-text-secondary font-medium">Status</th>
                      <th className="text-right p-3 text-text-secondary font-medium">ASP</th>
                      <th className="text-right p-3 text-text-secondary font-medium">Gross</th>
                      <th className="text-right p-3 text-text-secondary font-medium">Net</th>
                      <th className="text-center p-3 text-text-secondary font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSales.map((sale) => (
                      <tr 
                        key={sale.id} 
                        className="hover:bg-bg-elevated/50 transition-colors cursor-pointer"
                        onClick={() => handleSaleClick(sale)}
                      >
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-text-primary">{sale.customer}</p>
                            <p className="text-xs text-text-muted">{sale.id} • {sale.date}</p>
                            {sale.cancelledDate && (
                              <p className="text-xs text-danger">Cancelled: {sale.cancelledDate}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {sale.commissionItems.map((item, idx) => (
                              <span key={idx} className={`px-1.5 py-0.5 rounded text-xs ${
                                item.type === 'internet' ? 'bg-accent-glow text-accent' :
                                item.type === 'mobile' ? 'bg-success-bg text-success' :
                                'bg-purple-bg text-purple'
                              }`}>
                                {item.product.split(' - ')[0]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {getClawbackBadge(sale.monthsActive, sale.status)}
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant="purple" className="text-xs">+{sale.totalASP}</Badge>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-semibold ${sale.status === 'cancelled' ? 'line-through text-text-muted' : 'text-success'}`}>
                            €{sale.totalCommission}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-bold ${sale.status === 'cancelled' ? 'text-danger' : 'text-success'}`}>
                            €{sale.netCommission.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaleClick(sale);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {sale.status === 'active' ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-danger hover:text-danger hover:bg-danger-bg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelSale(sale.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-success hover:text-success hover:bg-success-bg"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReactivateSale(sale.id);
                                }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Clawback Info */}
              <div className="mt-4 p-4 bg-warning-bg rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-warning mb-1">Clawback Rules</p>
                    <p className="text-text-secondary">
                      Contracts under 1 month: <span className="text-danger">0% paid (pending)</span> • 
                      1-6 months: <span className="text-warning">25% paid (75% clawback)</span> • 
                      6+ months: <span className="text-success">75% paid (25% clawback)</span>
                    </p>
                    <p className="text-xs text-text-muted mt-2">
                      Cancelled contracts result in 100% clawback. These amounts are deducted from your total earnings.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Upline & Stats */}
        <div className="space-y-6">
          {/* Commission Breakdown Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Earnings Summary</CardTitle>
                  <p className="text-sm text-text-muted">After clawback deductions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-secondary">Gross Commissions</span>
                  <span className="font-semibold">€{totalEarned.toFixed(0)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-secondary">Upline Team</span>
                  <span className="font-semibold text-purple">
                    €{UPLINE_DATA.reduce((sum, l) => sum + l.commission, 0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-danger">Total Clawbacks</span>
                  <span className="font-semibold text-danger">-€{totalClawback.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 bg-success-bg rounded-xl px-3">
                  <span className="font-semibold text-success">Net Earnings</span>
                  <span className="text-xl font-bold text-success">
                    €{(totalNet + UPLINE_DATA.reduce((sum, l) => sum + l.commission, 0)).toFixed(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upline Commission */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <CardTitle>Your Team</CardTitle>
                  <p className="text-sm text-text-muted">Upline commissions from niveaus</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {UPLINE_DATA.map((level) => (
                  <div key={level.level} className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        level.level === 1 
                          ? 'bg-accent-glow text-accent' 
                          : 'bg-bg-surface text-text-muted'
                      }`}>
                        {level.level}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{level.consultant}</p>
                        <p className="text-xs text-text-muted">{level.sales} sales • {level.rate}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-purple">€{level.commission}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">Total Upline</span>
                  <span className="text-xl font-bold text-purple">
                    €{UPLINE_DATA.reduce((sum, l) => sum + l.commission, 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto bg-bg-surface rounded-2xl shadow-modal border border-border-strong animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-bg-surface border-b border-border p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="h3">{selectedSale.customer}</h2>
                    {selectedSale.status === 'cancelled' ? (
                      <Badge variant="danger">Cancelled</Badge>
                    ) : (
                      getClawbackBadge(selectedSale.monthsActive, selectedSale.status)
                    )}
                  </div>
                  <p className="text-sm text-text-muted">
                    {selectedSale.id} • Sale date: {selectedSale.date} • 
                    {selectedSale.monthsActive < 1 ? ' < 1 month active' : ` ${selectedSale.monthsActive} months active`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </>
                  )}
                  <button onClick={handleCloseModal} className="p-2 hover:bg-bg-elevated rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Commission Breakdown Table */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Commissie Opbouw
                </h3>
                
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-bg-elevated">
                      <tr>
                        <th className="text-left p-3 text-text-secondary font-medium">Product</th>
                        <th className="text-right p-3 text-text-secondary font-medium">Basis</th>
                        <th className="text-right p-3 text-text-secondary font-medium text-success">Portability</th>
                        <th className="text-right p-3 text-text-secondary font-medium text-purple">Convergentie</th>
                        <th className="text-right p-3 text-text-secondary font-medium">Totaal</th>
                        <th className="text-right p-3 text-text-secondary font-medium text-purple">ASP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(isEditing ? editedItems : selectedSale.commissionItems).map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {item.type === 'internet' && <Wifi className="w-4 h-4 text-accent" />}
                              {item.type === 'mobile' && <Smartphone className="w-4 h-4 text-success" />}
                              {item.type === 'tv' && <Tv className="w-4 h-4 text-purple" />}
                              <span className="font-medium text-text-primary">{item.product}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.base}
                                onChange={(e) => handleEditItem(idx, 'base', Number(e.target.value))}
                                className="w-20 px-2 py-1 bg-bg-elevated border border-border rounded text-right"
                              />
                            ) : (
                              <span>€{item.base}</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.portability}
                                onChange={(e) => handleEditItem(idx, 'portability', Number(e.target.value))}
                                className="w-20 px-2 py-1 bg-bg-elevated border border-border rounded text-right text-success"
                              />
                            ) : (
                              item.portability > 0 && <span className="text-success">+€{item.portability}</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={item.convergence}
                                onChange={(e) => handleEditItem(idx, 'convergence', Number(e.target.value))}
                                className="w-20 px-2 py-1 bg-bg-elevated border border-border rounded text-right text-purple"
                              />
                            ) : (
                              item.convergence > 0 && <span className="text-purple">+€{item.convergence}</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-bold text-text-primary">
                            €{isEditing 
                              ? (item.base + item.portability + item.convergence)
                              : item.total
                            }
                          </td>
                          <td className="p-3 text-right">
                            <Badge variant="purple">+{item.aspPoints}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-bg-elevated font-semibold">
                      <tr>
                        <td className="p-3 text-text-primary">TOTAAL</td>
                        <td className="p-3 text-right">
                          €{(isEditing ? editedItems : selectedSale.commissionItems).reduce((s, i) => s + i.base, 0)}
                        </td>
                        <td className="p-3 text-right text-success">
                          +€{(isEditing ? editedItems : selectedSale.commissionItems).reduce((s, i) => s + i.portability, 0)}
                        </td>
                        <td className="p-3 text-right text-purple">
                          +€{(isEditing ? editedItems : selectedSale.commissionItems).reduce((s, i) => s + i.convergence, 0)}
                        </td>
                        <td className="p-3 text-right text-accent text-lg">
                          €{isEditing 
                            ? editedItems.reduce((s, i) => s + i.base + i.portability + i.convergence, 0)
                            : selectedSale.totalCommission
                          }
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant="purple" className="text-lg">{selectedSale.totalASP} ASP</Badge>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Commission Calculation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className={selectedSale.status === 'cancelled' ? 'border-danger/30' : 'border-success/30'}>
                  <CardContent className="p-4">
                    <p className="text-sm text-text-muted mb-1">Gross Commission</p>
                    <p className={`text-3xl font-bold ${selectedSale.status === 'cancelled' ? 'line-through text-text-muted' : 'text-success'}`}>
                      €{selectedSale.totalCommission}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      100% uitbetaald: €{selectedSale.totalCommission.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <Card className={selectedSale.status === 'cancelled' ? 'border-danger/30 bg-danger-bg/20' : 'border-warning/30'}>
                  <CardContent className="p-4">
                    <p className="text-sm text-text-muted mb-1">
                      {selectedSale.status === 'cancelled' ? 'Clawback (100%)' : 'Clawback / Pending'}
                    </p>
                    <p className={`text-3xl font-bold ${selectedSale.status === 'cancelled' ? 'text-danger' : 'text-warning'}`}>
                      {selectedSale.status === 'cancelled' 
                        ? `-€${selectedSale.totalCommission}`
                        : `-€${selectedSale.clawbackAmount.toFixed(2)}`
                      }
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {selectedSale.status === 'cancelled' 
                        ? 'Contract cancelled - full clawback'
                        : selectedSale.monthsActive < 1 
                          ? 'Pending: 0% paid (contract < 1 month)'
                          : selectedSale.monthsActive < 6
                            ? '25% paid (75% clawback)'
                            : '75% paid (25% clawback)'
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Net Commission */}
              <div className={`p-4 rounded-xl ${
                selectedSale.status === 'cancelled' 
                  ? 'bg-danger-bg border border-danger/20' 
                  : 'bg-success-bg border border-success/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${selectedSale.status === 'cancelled' ? 'text-danger' : 'text-success'}`}>
                      Net Commission (what you receive)
                    </p>
                    <p className="text-sm text-text-muted">
                      {selectedSale.status === 'cancelled' 
                        ? 'This sale has been cancelled'
                        : selectedSale.monthsActive < 1
                          ? 'Will be available after 1 month'
                          : 'Already or will be paid out'
                      }
                    </p>
                  </div>
                  <p className={`text-4xl font-bold ${selectedSale.status === 'cancelled' ? 'text-danger' : 'text-success'}`}>
                    €{selectedSale.netCommission.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                {selectedSale.status === 'active' ? (
                  <Button 
                    variant="danger" 
                    className="flex-1"
                    onClick={() => handleCancelSale(selectedSale.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Mark as Cancelled (Clawback)
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    className="flex-1"
                    onClick={() => handleReactivateSale(selectedSale.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Reactivate Sale
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
