'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  Smartphone, 
  Tv, 
  Plus, 
  Minus,
  Euro,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Phone,
  Settings,
  User,
  X,
  TrendingUp,
  FileText,
  Save,
  Zap,
  Info,
  RefreshCw,
  Signal,
  Home,
  Download,
  Building2,
  MapPin,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import type { Rank } from '@/lib/commission-engine';

// User rank (should come from auth context)
const USER_RANK: Rank = 'PMC';

// Orange Belgium pricing
const INTERNET_OPTIONS = [
  { key: 'START', name: 'Start Fiber', speed: '200 Mbps', priceStandalone: 53, pricePack: 49 },
  { key: 'ZEN', name: 'Zen Fiber', speed: '500 Mbps', priceStandalone: 62, pricePack: 58, popular: true },
  { key: 'GIGA', name: 'Giga Fiber', speed: '1000 Mbps', priceStandalone: 72, pricePack: 68 },
];

const MOBILE_OPTIONS = [
  { key: 'CHILD', name: 'Child', data: '2 GB', price: 14, bcCommission: 1, scCommission: 5 },
  { key: 'SMALL', name: 'Small', data: '12 GB', price: 15, bcCommission: 10, scCommission: 15 },
  { key: 'MEDIUM', name: 'Medium', data: '70 GB', price: 23, bcCommission: 35, scCommission: 40 },
  { key: 'LARGE', name: 'Large', data: '140 GB', price: 30, bcCommission: 50, scCommission: 55 },
  { key: 'UNLIMITED', name: 'Unlimited', data: '∞', price: 40, bcCommission: 60, scCommission: 65 },
];

const TV_OPTIONS = [
  { key: 'NONE', name: 'No TV', price: 0 },
  { key: 'LIFE', name: 'Orange TV Life', price: 10 },
  { key: 'TV', name: 'Orange TV', price: 20 },
  { key: 'PLUS', name: 'Orange TV Plus', price: 32 },
];

// Second address internet options (€10 discount)
const SECOND_ADDRESS_OPTIONS = [
  { key: 'START_2ND', name: 'Start Fiber (2nd Address)', speed: '200 Mbps', price: 43 },
  { key: 'ZEN_2ND', name: 'Zen Fiber (2nd Address)', speed: '500 Mbps', price: 48, popular: true },
  { key: 'GIGA_2ND', name: 'Giga Fiber (2nd Address)', speed: '1000 Mbps', price: 58 },
];

export default function CalculatorPage() {
  const [currentCost, setCurrentCost] = useState(0);
  const [internet, setInternet] = useState<string | null>(null);
  const [internetPortability, setInternetPortability] = useState(false);
  const [internetComfort, setInternetComfort] = useState(false);
  const [secondAddress, setSecondAddress] = useState<string | null>(null);
  const [mobileLines, setMobileLines] = useState<Array<{
    plan: string; 
    portability: boolean;
    soho: boolean;
  }>>([]);
  const [tv, setTv] = useState('NONE');
  const [extraDecoders, setExtraDecoders] = useState(0);
  const [wifiBoosters, setWifiBoosters] = useState(0);
  const [landline, setLandline] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const [results, setResults] = useState({
    newMonthly: 0,
    savings: 0,
    yearlySavings: 0,
    commission: 0,
    breakdown: {
      baseCommission: 0,
      convergenceBonus: 0,
      portabilityBonus: 0,
      sohoBonus: 0,
    }
  });

  // Calculate everything whenever dependencies change
  useEffect(() => {
    let totalPrice = 0;
    let totalCommission = 0;
    let baseCommission = 0;
    let convergenceBonus = 0;
    let portabilityBonus = 0;
    let sohoBonus = 0;
    
    const hasMobile = mobileLines.length > 0;
    const hasInternet = !!internet;
    const hasSecondAddress = !!secondAddress;

    // Primary Internet pricing
    if (internet) {
      const internetOption = INTERNET_OPTIONS.find(i => i.key === internet);
      if (internetOption) {
        // If mobile exists, use pack price, else standalone
        totalPrice += hasMobile ? internetOption.pricePack : internetOption.priceStandalone;
        
        // Internet commission (PMC = €20)
        const internetComm = USER_RANK === 'BC' ? 15 : 20;
        baseCommission += internetComm;
        
        // Convergence bonus on internet (+€15 when with mobile) - works regardless of order
        if (hasMobile) {
          convergenceBonus += 15;
        }
        
        // Internet portability bonus (Easy Switch +€12)
        if (internetPortability) {
          portabilityBonus += 12;
        }
      }
      // My Comfort
      if (internetComfort) totalPrice += internet === 'GIGA' ? 5 : 10;
    }

    // Second Address Internet (€10 discount, no convergence bonus)
    if (secondAddress) {
      const secondOption = SECOND_ADDRESS_OPTIONS.find(i => i.key === secondAddress);
      if (secondOption) {
        totalPrice += secondOption.price;
        // Commission for second address (no convergence)
        const internetComm = USER_RANK === 'BC' ? 15 : 20;
        baseCommission += internetComm;
      }
    }

    // Mobile lines - convergence works regardless of order!
    mobileLines.forEach((line, index) => {
      if (!line.plan) return;
      
      const plan = MOBILE_OPTIONS.find(p => p.key === line.plan);
      if (!plan) return;
      
      // Price calculation
      totalPrice += plan.price;
      
      // Commission based on rank
      const comm = USER_RANK === 'BC' ? plan.bcCommission : plan.scCommission;
      baseCommission += comm;
      
      // Bonuses only for Medium, Large, Unlimited
      if (['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) {
        // Convergence bonus (+€12 on 1st line when with internet) - WORKS regardless of order!
        if (hasInternet && index === 0) {
          convergenceBonus += 12;
        }
        
        // Portability bonus (+€20)
        if (line.portability) {
          portabilityBonus += 20;
        }
        
        // SoHo bonus (+€15)
        if (line.soho) {
          sohoBonus += 15;
        }
      }
    });

    // TV
    if (tv !== 'NONE') {
      const tvOption = TV_OPTIONS.find(t => t.key === tv);
      if (tvOption) {
        totalPrice += tvOption.price;
        baseCommission += 10; // TV commission
      }
      // Extra decoders: max 3 extra (total max 4)
      totalPrice += extraDecoders * 9;
    }

    // WiFi Boosters (max 3, €3/month each)
    totalPrice += wifiBoosters * 3;

    // Landline (€12/month)
    if (landline) totalPrice += 12;

    const savings = Math.max(0, currentCost - totalPrice);
    totalCommission = baseCommission + convergenceBonus + portabilityBonus + sohoBonus;
    
    setResults({
      newMonthly: totalPrice,
      savings,
      yearlySavings: savings * 12,
      commission: totalCommission,
      breakdown: {
        baseCommission,
        convergenceBonus,
        portabilityBonus,
        sohoBonus,
      }
    });
  }, [internet, secondAddress, internetPortability, internetComfort, mobileLines, tv, extraDecoders, wifiBoosters, landline, currentCost]);

  const addMobileLine = () => {
    setMobileLines([...mobileLines, { plan: '', portability: false, soho: false }]);
  };

  const removeMobileLine = (idx: number) => {
    setMobileLines(mobileLines.filter((_, i) => i !== idx));
  };

  const updateMobileLine = (idx: number, field: string, value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  const hasConvergence = (internet || secondAddress) && mobileLines.length > 0;
  const eligibleForBonuses = (plan: string) => ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(plan);

  const handleGenerateQuote = () => {
    setShowQuoteModal(true);
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
            <h1 className="h1">Price Calculator</h1>
            <p className="body-md text-text-secondary">Calculate prices and commission for your customer</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-14">
          <Badge variant="purple">Rank: {USER_RANK}</Badge>
          <span className="text-sm text-text-muted">Commission rates shown for {USER_RANK}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Calculator Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Cost */}
          <Card>
            <CardHeader>
              <CardTitle>Current Monthly Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="number"
                    value={currentCost || ''}
                    onChange={(e) => setCurrentCost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-xl text-2xl font-bold text-text-primary focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <span className="text-text-muted">/month</span>
              </div>
            </CardContent>
          </Card>

          {/* Primary Internet Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-accent" />
                  </div>
                  <CardTitle>Select Internet</CardTitle>
                </div>
                {USER_RANK !== 'BC' && (
                  <Badge variant="green">+€5 extra commission</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {INTERNET_OPTIONS.map((option) => {
                  const isSelected = internet === option.key;
                  const hasMobileLines = mobileLines.length > 0;
                  const price = hasMobileLines ? option.pricePack : option.priceStandalone;
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => setInternet(isSelected ? null : option.key)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-accent bg-accent-glow' 
                          : 'border-border bg-bg-elevated hover:border-border-strong'
                      }`}
                    >
                      {option.popular && (
                        <Badge variant="orange" className="absolute -top-2 left-4">Popular</Badge>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-text-primary">{option.name}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-accent" />}
                      </div>
                      <p className="text-2xl font-bold text-accent mb-1">€{price}</p>
                      <p className="text-sm text-text-muted">{option.speed}</p>
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-success">
                          Commission: €{USER_RANK === 'BC' ? 15 : 20}
                          {hasMobileLines && ' + €15 conv.'}
                          {internetPortability && ' + €12 Easy Switch'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Internet Options */}
              {internet && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {/* Easy Switch (Portability) */}
                  <label className="flex items-center justify-between p-3 bg-blue-bg rounded-xl cursor-pointer border border-blue/20">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 text-blue" />
                      <div>
                        <p className="font-medium text-text-primary">Easy Switch</p>
                        <p className="text-sm text-text-muted">Keep your current number (+€12 commission)</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={internetPortability}
                      onChange={(e) => setInternetPortability(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-blue focus:ring-blue"
                    />
                  </label>

                  {/* My Comfort */}
                  <label className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-text-muted" />
                      <div>
                        <p className="font-medium text-text-primary">My Comfort</p>
                        <p className="text-sm text-text-muted">+€{internet === 'GIGA' ? 5 : 10}/month</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={internetComfort}
                      onChange={(e) => setInternetComfort(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-accent focus:ring-accent"
                    />
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Second Address Internet */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple" />
                  </div>
                  <div>
                    <CardTitle>Second Address</CardTitle>
                    <p className="text-xs text-text-muted">€10 discount on additional location</p>
                  </div>
                </div>
                <Badge variant="purple">-€10/month</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SECOND_ADDRESS_OPTIONS.map((option) => {
                  const isSelected = secondAddress === option.key;
                  
                  return (
                    <button
                      key={option.key}
                      onClick={() => setSecondAddress(isSelected ? null : option.key)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-purple bg-purple-bg' 
                          : 'border-border bg-bg-elevated hover:border-border-strong'
                      }`}
                    >
                      {option.popular && (
                        <Badge variant="purple" className="absolute -top-2 left-4">Popular</Badge>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-text-primary text-sm">{option.name}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-purple" />}
                      </div>
                      <p className="text-2xl font-bold text-purple mb-1">€{option.price}</p>
                      <p className="text-sm text-text-muted">{option.speed}</p>
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-purple">
                          Commission: €{USER_RANK === 'BC' ? 15 : 20}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!internet && (
                <div className="mt-4 p-3 bg-warning-bg rounded-xl">
                  <p className="text-sm text-warning">
                    <Info className="w-4 h-4 inline mr-2" />
                    Select primary internet first for best pricing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Lines */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <CardTitle>Mobile Lines</CardTitle>
                    <p className="text-xs text-text-muted">
                      Convergence: +€12 (1st line) • Portability: +€20 • SoHo: +€15
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={addMobileLine}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {mobileLines.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No mobile lines added yet</p>
                  <p className="text-sm">Add lines to calculate commission</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mobileLines.map((line, idx) => (
                    <div key={idx} className="p-4 bg-bg-elevated rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-text-primary">Line {idx + 1}</span>
                        <button 
                          onClick={() => removeMobileLine(idx)}
                          className="p-1 hover:bg-danger-bg rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-danger" />
                        </button>
                      </div>
                      
                      <select
                        value={line.plan}
                        onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                        className="w-full p-3 bg-bg-surface border border-border rounded-xl text-text-primary focus:border-accent focus:outline-none mb-3"
                      >
                        <option value="">Select plan</option>
                        {MOBILE_OPTIONS.map((plan) => (
                          <option key={plan.key} value={plan.key}>
                            {plan.name} ({plan.data}) - €{plan.price} - Comm: €{USER_RANK === 'BC' ? plan.bcCommission : plan.scCommission}
                          </option>
                        ))}
                      </select>

                      {line.plan && (
                        <div className="space-y-2">
                          {/* Commission display */}
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-text-muted">Base Commission:</span>
                            <span className="font-semibold text-success">
                              €{USER_RANK === 'BC' 
                                ? MOBILE_OPTIONS.find(p => p.key === line.plan)?.bcCommission 
                                : MOBILE_OPTIONS.find(p => p.key === line.plan)?.scCommission}
                            </span>
                          </div>
                          
                          {/* Bonuses only for Medium+ */}
                          {eligibleForBonuses(line.plan) && (
                            <>
                              {(internet || secondAddress) && idx === 0 && (
                                <div className="flex items-center justify-between p-2 bg-blue-bg rounded-lg text-sm">
                                  <span className="text-blue flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Convergence bonus applied
                                  </span>
                                  <span className="font-semibold text-blue">+€12</span>
                                </div>
                              )}
                              
                              <label className="flex items-center justify-between p-3 bg-success-bg rounded-xl cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={line.portability}
                                    onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-success focus:ring-success"
                                  />
                                  <span className="text-sm text-success">Number Portability</span>
                                </div>
                                <span className="text-sm font-semibold text-success">+€20</span>
                              </label>
                              
                              <label className="flex items-center justify-between p-3 bg-purple-bg rounded-xl cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={line.soho}
                                    onChange={(e) => updateMobileLine(idx, 'soho', e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-purple focus:ring-purple"
                                  />
                                  <span className="text-sm text-purple">SoHo Business</span>
                                </div>
                                <span className="text-sm font-semibold text-purple">+€15</span>
                              </label>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* TV Options */}
          <Card className={!(internet || secondAddress) ? 'opacity-50 pointer-events-none' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                  <Tv className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <CardTitle>TV (Optional)</CardTitle>
                  <p className="text-xs text-text-muted">Commission: €10</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TV_OPTIONS.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setTv(option.key)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      tv === option.key 
                        ? 'border-accent bg-accent-glow' 
                        : 'border-border bg-bg-elevated hover:border-border-strong'
                    }`}
                  >
                    <p className="font-medium text-text-primary mb-1">{option.name}</p>
                    <p className="text-xl font-bold text-accent">€{option.price}</p>
                    {option.key !== 'NONE' && (
                      <p className="text-xs text-success mt-1">+€10 comm</p>
                    )}
                  </button>
                ))}
              </div>
              
              {tv !== 'NONE' && (
                <div className="mt-4 pt-4 border-t border-border space-y-4">
                  {/* Extra Decoders - Max 3 extra (total max 4) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-text-secondary font-medium">Extra Decoders</span>
                      <p className="text-xs text-text-muted">Max 3 extra (€9/month each)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setExtraDecoders(Math.max(0, extraDecoders - 1))}
                        className="w-8 h-8 bg-bg-surface rounded-lg flex items-center justify-center hover:bg-bg-overlay border border-border"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{extraDecoders}</span>
                      <button 
                        onClick={() => setExtraDecoders(Math.min(3, extraDecoders + 1))}
                        disabled={extraDecoders >= 3}
                        className="w-8 h-8 bg-bg-surface rounded-lg flex items-center justify-center hover:bg-bg-overlay border border-border disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Extra Services */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-bg rounded-xl flex items-center justify-center">
                  <Signal className="w-5 h-5 text-blue" />
                </div>
                <CardTitle>Extra Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* WiFi Boosters - Max 3 */}
                <div className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-blue" />
                    <div>
                      <p className="font-medium text-text-primary">WiFi Booster</p>
                      <p className="text-sm text-text-muted">+€3/month each • Max 3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setWifiBoosters(Math.max(0, wifiBoosters - 1))}
                      className="w-8 h-8 bg-bg-surface rounded-lg flex items-center justify-center hover:bg-bg-overlay border border-border"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{wifiBoosters}</span>
                    <button 
                      onClick={() => setWifiBoosters(Math.min(3, wifiBoosters + 1))}
                      disabled={wifiBoosters >= 3}
                      className="w-8 h-8 bg-bg-surface rounded-lg flex items-center justify-center hover:bg-bg-overlay border border-border disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Landline */}
                <label className="flex items-center justify-between p-3 bg-bg-elevated rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-text-primary">Fixed Line</p>
                      <p className="text-sm text-text-muted">+€12/month</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={landline}
                    onChange={(e) => setLandline(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-success focus:ring-success"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Customer Summary */}
          <Card className="border-accent/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <CardTitle>For Customer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4 p-3 bg-bg-elevated rounded-xl">
                <div className="text-center flex-1">
                  <p className="text-xs text-text-muted uppercase tracking-wider">Now</p>
                  <p className="text-2xl font-bold text-text-secondary">€{currentCost}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
                <div className="text-center flex-1">
                  <p className="text-xs text-accent uppercase tracking-wider">With SmartSN</p>
                  <p className="text-2xl font-bold text-accent">€{results.newMonthly}</p>
                </div>
              </div>
              
              {results.savings > 0 && (
                <div className="text-center p-4 bg-success-bg rounded-xl">
                  <p className="text-sm text-success mb-1">Monthly Savings</p>
                  <p className="text-3xl font-bold text-success">€{results.savings}</p>
                  <p className="text-sm text-success/80 mt-1">€{results.yearlySavings}/year</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission Summary */}
          <Card className="border-success/30 bg-success-bg/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <CardTitle className="text-success">Your Commission</CardTitle>
                </div>
                <Badge variant="purple">{USER_RANK}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-success">€{results.commission}</p>
                <p className="text-sm text-text-muted mt-2">One-time commission on sale</p>
              </div>
              
              {/* Commission Breakdown */}
              <button 
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between p-3 bg-bg-elevated rounded-xl hover:bg-bg-overlay transition-colors"
              >
                <span className="text-sm font-medium text-text-primary">View Breakdown</span>
                <ChevronRight className={`w-4 h-4 text-text-muted transition-transform ${showBreakdown ? 'rotate-90' : ''}`} />
              </button>
              
              {showBreakdown && (
                <div className="mt-3 space-y-2 text-sm animate-fade-in">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-text-secondary">Base Commission</span>
                    <span className="font-semibold">€{results.breakdown.baseCommission}</span>
                  </div>
                  {results.breakdown.convergenceBonus > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-blue">Convergence Bonus</span>
                      <span className="font-semibold text-blue">+€{results.breakdown.convergenceBonus}</span>
                    </div>
                  )}
                  {results.breakdown.portabilityBonus > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-success">Portability Bonus</span>
                      <span className="font-semibold text-success">+€{results.breakdown.portabilityBonus}</span>
                    </div>
                  )}
                  {results.breakdown.sohoBonus > 0 && (
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-purple">SoHo Bonus</span>
                      <span className="font-semibold text-purple">+€{results.breakdown.sohoBonus}</span>
                    </div>
                  )}
                  <div className="pt-2 flex justify-between">
                    <span className="font-semibold text-text-primary">Total</span>
                    <span className="font-bold text-success text-lg">€{results.commission}</span>
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-bg-elevated rounded-xl">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-text-muted mt-0.5" />
                  <p className="text-xs text-text-muted">
                    Commission is paid after customer activation. Subject to clawback protection based on contract duration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Fidelity Preview */}
          {hasConvergence && (
            <Card className="border-blue/30 bg-blue-bg/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue" />
                  <CardTitle className="text-blue">Monthly Fidelity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-3">
                  Estimated monthly passive income from this sale:
                </p>
                <div className="space-y-2">
                  {internet && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Internet (Primary)</span>
                      <span className="font-semibold">€0.35/month</span>
                    </div>
                  )}
                  {secondAddress && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Internet (2nd Address)</span>
                      <span className="font-semibold">€0.35/month</span>
                    </div>
                  )}
                  {mobileLines.filter(l => l.plan).map((line, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-text-secondary">Mobile {idx + 1}</span>
                      <span className="font-semibold">
                        €{line.plan === 'CHILD' ? '0.25' : 
                           line.plan === 'SMALL' ? '0.50' : 
                           line.plan === 'MEDIUM' ? '1.00' : 
                           line.plan === 'LARGE' ? '1.25' : '1.50'}/month
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border flex justify-between">
                    <span className="font-semibold text-text-primary">Total Monthly</span>
                    <span className="font-bold text-blue">
                      €{(internet ? 0.35 : 0) + (secondAddress ? 0.35 : 0) + mobileLines.filter(l => l.plan).reduce((sum, line) => {
                        const rates: Record<string, number> = { CHILD: 0.25, SMALL: 0.50, MEDIUM: 1.00, LARGE: 1.25, UNLIMITED: 1.50 };
                        return sum + (rates[line.plan] || 0);
                      }, 0)}/month
                    </span>
                  </div>
                </div>
                <Link href="/fidelity">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    View Fidelity Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full" 
              disabled={!internet || mobileLines.length === 0}
              onClick={handleGenerateQuote}
            >
              <FileText className="w-5 h-5 mr-2" />
              Generate Quote
            </Button>
            <Button variant="secondary" className="w-full" disabled={!internet}>
              <Save className="w-5 h-5 mr-2" />
              Save as Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQuoteModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-bg-surface rounded-2xl shadow-modal border border-border-strong animate-scale-in">
            <div className="sticky top-0 bg-bg-surface border-b border-border p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-accent" />
                  <h2 className="h3">Quote Generated</h2>
                </div>
                <button 
                  onClick={() => setShowQuoteModal(false)}
                  className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="p-4 bg-bg-elevated rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-text-primary">Selected Services</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {internet && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {INTERNET_OPTIONS.find(i => i.key === internet)?.name}
                      </span>
                      <span className="font-semibold">
                        €{mobileLines.length > 0 
                          ? INTERNET_OPTIONS.find(i => i.key === internet)?.pricePack 
                          : INTERNET_OPTIONS.find(i => i.key === internet)?.priceStandalone}/month
                      </span>
                    </div>
                  )}
                  {secondAddress && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {SECOND_ADDRESS_OPTIONS.find(i => i.key === secondAddress)?.name}
                      </span>
                      <span className="font-semibold text-purple">
                        €{SECOND_ADDRESS_OPTIONS.find(i => i.key === secondAddress)?.price}/month
                      </span>
                    </div>
                  )}
                  {mobileLines.filter(l => l.plan).map((line, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-text-secondary">
                        Mobile Line {idx + 1} - {MOBILE_OPTIONS.find(p => p.key === line.plan)?.name}
                      </span>
                      <span className="font-semibold">
                        €{MOBILE_OPTIONS.find(p => p.key === line.plan)?.price}/month
                      </span>
                    </div>
                  ))}
                  {tv !== 'NONE' && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        {TV_OPTIONS.find(t => t.key === tv)?.name}
                      </span>
                      <span className="font-semibold">
                        €{TV_OPTIONS.find(t => t.key === tv)?.price}/month
                      </span>
                    </div>
                  )}
                  {wifiBoosters > 0 && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">WiFi Boosters ({wifiBoosters}x)</span>
                      <span className="font-semibold">€{wifiBoosters * 3}/month</span>
                    </div>
                  )}
                  {landline && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Fixed Line</span>
                      <span className="font-semibold">€12/month</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-text-primary">Total Monthly</span>
                    <span className="text-xl font-bold text-accent">€{results.newMonthly}/month</span>
                  </div>
                </div>
              </div>

              {/* Commission Info */}
              <div className="p-4 bg-success-bg rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-success">Your Commission</h3>
                </div>
                <p className="text-3xl font-bold text-success">€{results.commission}</p>
                <p className="text-sm text-success/80 mt-1">One-time commission on this sale</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => window.print()}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="secondary" className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
