'use client';

import { useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy,
  Target,
  Gift,
  Star,
  Zap,
  CheckCircle2,
  Lock,
  Rocket,
  Award,
  TrendingUp,
  Users,
  Crown,
  Sparkles,
  Wallet,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar
} from 'lucide-react';
import type { Rank } from '@/lib/commission-engine';

// User data
const USER_DATA = {
  rank: 'PMC' as Rank,
  totalPoints: 185,
  pqsAchieved: true,
  currentQuarter: 'Q1 2025',
};

// PQS Points Structure
const PQS_STRUCTURE = [
  { label: 'PQS', points: 50 },
  { label: 'Q1', points: 20 },
  { label: 'Q2', points: 10 },
  { label: 'Q3', points: 5 },
  { label: 'Q4', points: 5 },
  { label: 'Q5', points: 5 },
  { label: 'Q6', points: 5 },
  { label: 'Q7', points: 10 },
];

// Team Promotions Structure
const TEAM_PROMOTIONS = [
  { niveau: 'Promo PERSO', titel: 10, bonus: 20 },
  { niveau: 'Niv1', titel: 10, bonus: 25 },
  { niveau: 'Niv2', titel: 10, bonus: 15 },
  { niveau: 'Niv3', titel: 5, bonus: 10 },
  { niveau: 'Niv4', titel: 5, bonus: 5 },
  { niveau: 'Niv5', titel: 5, bonus: 5 },
  { niveau: 'Niv6', titel: 5, bonus: 5 },
  { niveau: 'Niv7', titel: 5, bonus: 5 },
];

// Complete Gift Matrix from Smart SN Documentation
const GIFT_MATRIX = {
  IRON: {
    points: 75,
    color: 'neutral',
    BC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    SC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    EC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    PC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    MC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    NMC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
    PMC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA cadeaubon €200', 'Tankkaart €200'],
  },
  BRONZE: {
    points: 100,
    color: 'orange',
    BC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    SC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    EC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    PC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    MC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    NMC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
    PMC: ['EUFY robotstofzuiger', 'Lenovo IdeaPad laptop', 'Bongo parachutesprong', 'Tankkaart €200'],
  },
  SILVER: {
    points: 150,
    color: 'blue',
    BC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    SC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    EC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    PC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    MC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    NMC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
    PMC: ['Apple iPhone 17', 'GOOD MORNING SALES €1000', 'ECOVACS robotmaaier', 'Kadonation voucher €1000'],
  },
  GOLD: {
    points: 225,
    color: 'warning',
    BC: ['Cash bonus €1000'],
    SC: ['Cash bonus €1000'],
    EC: ['Cash bonus €1000'],
    PC: ['Cash bonus €1000'],
    MC: ['Cash bonus €1000'],
    NMC: ['Cash bonus €1000'],
    PMC: ['Cash bonus €1000'],
  },
  PLATINUM: {
    points: 325,
    color: 'purple',
    BC: ['Cash bonus €1000'],
    SC: ['Cash bonus €1000'],
    EC: ['Cash bonus €1000'],
    PC: ['Cash bonus €1000'],
    MC: ['Cash bonus €1500'],
    NMC: ['Cash bonus €1750'],
    PMC: ['Cash bonus €2000'],
  },
  SAPPHIRE: {
    points: 400,
    color: 'blue',
    BC: ['Cash bonus €1000'],
    SC: ['Cash bonus €1500'],
    EC: ['Cash bonus €1750'],
    PC: ['Cash bonus €2000'],
    MC: ['Cash bonus €2250'],
    NMC: ['Cash bonus €2500'],
    PMC: ['Cash bonus €2750'],
  },
  DIAMOND: {
    points: 500,
    color: 'cyan',
    BC: ['Cash bonus €1500'],
    SC: ['Cash bonus €2000'],
    EC: ['Cash bonus €2500'],
    PC: ['Cash bonus €2750'],
    MC: ['Cash bonus €3000'],
    NMC: ['Cash bonus €3250'],
    PMC: ['Cash bonus €3500'],
  },
};

// Gift descriptions
const GIFT_DESCRIPTIONS: Record<string, string> = {
  'Tankkaart': 'prepaid tankkaart Total Happy Fuel van €200 of €300',
  'Lenovo Tablet': 'Tab M11 2024 - 128 GB - Grijs - Tab + Lenovo Tab Pen',
  'JBL PartyBox': 'Encore 2 Essential',
  'IKEA cadeaubon': 'een cadeaubon ter waarde van €200 te besteden bij IKEA',
  'EUFY robotstofzuiger': 'EUFY RoboVac G32 Pro 3-in-1 E20 Grijs',
  'Lenovo IdeaPad laptop': 'Slim 3 15IAN8 - 15.6 inch - Full HD - Intel® N100 - 4 GB - 128 GB - UHD Graphics',
  'Bongo parachutesprong': 'Tandemsprong bij Skydive Spa met overnachting in de Belgische Ardennen',
  'Apple iPhone 17': 'Apple iPhone 17 - 256GB - Sage',
  'GOOD MORNING SALES': 'GOOD MORNING SALES (Sales audit + 8h coaching hybride live/teams) + Video platform access',
  'ECOVACS robotmaaier': 'ECOVACS GOAT 0800 RTK - Robotmaaier',
  'Kadonation': 'een bon ter waarde van €1000 te besteden in meer dan 1.000 winkels',
  'Cash bonus': 'een cash bonus',
};

// PQS Info
const PQS_INFO = {
  deadlineDays: 40,
  requiredASP: 12,
  bonus: 150,
  points: 50,
};

export default function IncentivesPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [selectedRankView, setSelectedRankView] = useState<Rank>(USER_DATA.rank);

  const unlockedTiers = Object.entries(GIFT_MATRIX).filter(([_, data]) => USER_DATA.totalPoints >= data.points);
  const nextTier = Object.entries(GIFT_MATRIX).find(([_, data]) => USER_DATA.totalPoints < data.points);

  const handleTierClick = (tier: string) => {
    setSelectedTier(tier);
    setShowGiftModal(true);
  };

  const selectedTierData = selectedTier ? GIFT_MATRIX[selectedTier as keyof typeof GIFT_MATRIX] : null;
  const availableGifts = selectedTierData ? selectedTierData[selectedRankView] : [];

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="h1">Incentives & Rewards</h1>
            <p className="body-md text-text-secondary mt-1">Smart SN Incentives Programma 2025</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-text-muted uppercase tracking-wider">Jouw ASP Punten</p>
              <p className="text-3xl font-bold text-accent">{USER_DATA.totalPoints}</p>
            </div>
            <div className="w-12 h-12 bg-accent-glow rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Rank Selector for Gift Preview */}
      <Card className="mb-6 border-accent/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-medium text-text-primary">Bekijk gifts voor rank:</span>
            </div>
            <div className="flex gap-2">
              {(['BC', 'SC', 'EC', 'PC', 'MC', 'NMC', 'PMC'] as Rank[]).map((rank) => (
                <button
                  key={rank}
                  onClick={() => setSelectedRankView(rank)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedRankView === rank
                      ? 'bg-accent text-white'
                      : 'bg-bg-elevated text-text-secondary hover:bg-bg-overlay'
                  }`}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Momenteel bekijk je: <span className="text-accent font-semibold">{selectedRankView}</span> gifts
          </p>
        </CardContent>
      </Card>

      {/* Quarter Incentives Card */}
      <Card className="mb-6 border-purple/30">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-text-secondary">{USER_DATA.currentQuarter}</span>
              </div>
              <h2 className="h2">Quarter Incentives</h2>
              <p className="text-text-secondary">Verzamel punten en kies je gift!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Jouw Punten</p>
              <p className="text-4xl font-bold text-accent">{USER_DATA.totalPoints}</p>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Object.entries(GIFT_MATRIX).map(([tierName, tierData]) => {
              const isUnlocked = USER_DATA.totalPoints >= tierData.points;
              const isNext = !isUnlocked && nextTier && nextTier[0] === tierName;
              
              const tierColors: Record<string, string> = {
                neutral: 'bg-zinc-800 text-zinc-400 border-zinc-600',
                orange: 'bg-orange-900/30 text-orange-400 border-orange-500/50',
                blue: 'bg-blue-900/30 text-blue-400 border-blue-500/50',
                warning: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/50',
                purple: 'bg-purple-900/30 text-purple-400 border-purple-500/50',
                cyan: 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50',
              };
              
              return (
                <button
                  key={tierName}
                  onClick={() => isUnlocked && handleTierClick(tierName)}
                  disabled={!isUnlocked}
                  className={`relative p-3 rounded-xl text-center transition-all ${
                    isUnlocked 
                      ? tierColors[tierData.color] + ' border-2 cursor-pointer hover:scale-105' 
                      : isNext
                        ? 'bg-bg-elevated border-2 border-dashed border-border-strong'
                        : 'bg-bg-elevated opacity-40'
                  }`}
                >
                  <p className="text-xs font-bold uppercase">{tierName}</p>
                  <p className="text-lg font-bold">{tierData.points}</p>
                  <p className="text-xs opacity-70">pts</p>
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between bg-bg-elevated rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div>
                {unlockedTiers.length > 0 ? (
                  <>
                    <p className="font-semibold text-text-primary">
                      {unlockedTiers.length} tier{unlockedTiers.length > 1 ? 's' : ''} ontgrendeld!
                    </p>
                    <p className="text-sm text-text-muted">Klik op een tier om je gift te kiezen</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-text-primary">Blijf punten verdienen!</p>
                    <p className="text-sm text-text-muted">
                      {nextTier ? `${nextTier[1].points - USER_DATA.totalPoints} punten tot ${nextTier[0]}` : 'Max tier bereikt!'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Badge variant="purple">Rank: {USER_DATA.rank}</Badge>
          </div>
        </div>
      </Card>

      {/* Points Structure Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PQS Points */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <CardTitle>PQS Punten Structuur</CardTitle>
                <p className="text-sm text-text-muted">Punten uit persoonlijke diensten</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="text-left p-3 text-text-secondary font-medium">Periode</th>
                    <th className="text-center p-3 text-text-secondary font-medium">Punten</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PQS_STRUCTURE.map((item) => (
                    <tr key={item.label} className={item.label === 'PQS' ? 'bg-success-bg/30' : ''}>
                      <td className="p-3 font-medium text-text-primary">{item.label}</td>
                      <td className="p-3 text-center">
                        <Badge variant={item.label === 'PQS' ? 'green' : 'neutral'}>
                          +{item.points}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-bg-elevated rounded-xl">
              <p className="text-xs text-text-muted">
                <Info className="w-4 h-4 inline mr-1" />
                PQS = Personal Quick Start (eenmalig bij start)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Promotions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-bg rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple" />
              </div>
              <div>
                <CardTitle>Team Promoties</CardTitle>
                <p className="text-sm text-text-muted">Punten uit team opbouw</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-bg-elevated">
                  <tr>
                    <th className="text-left p-3 text-text-secondary font-medium">Niveau</th>
                    <th className="text-center p-3 text-text-secondary font-medium">Titel</th>
                    <th className="text-center p-3 text-text-secondary font-medium">Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TEAM_PROMOTIONS.map((item) => (
                    <tr key={item.niveau} className={item.niveau === 'Promo PERSO' ? 'bg-purple-bg/30' : ''}>
                      <td className="p-3 font-medium text-text-primary">{item.niveau}</td>
                      <td className="p-3 text-center text-accent font-semibold">+{item.titel}</td>
                      <td className="p-3 text-center text-success font-semibold">+{item.bonus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-bg-elevated rounded-xl">
              <p className="text-xs text-text-muted">
                <Info className="w-4 h-4 inline mr-1" />
                Titel = ASP punten, Bonus = Extra reward punten
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gift Overview Table */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle>Gift Punten Overzicht</CardTitle>
                <p className="text-sm text-text-muted">Alle beschikbare gifts per tier en rank</p>
              </div>
            </div>
            <Badge variant="purple">Bekijk: {selectedRankView}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-bg-elevated">
                <tr>
                  <th className="text-left p-3 text-text-secondary font-medium">Tier</th>
                  <th className="text-center p-3 text-text-secondary font-medium">Punten</th>
                  <th className="text-left p-3 text-text-secondary font-medium">Gifts voor {selectedRankView}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(GIFT_MATRIX).map(([tierName, tierData]) => (
                  <tr key={tierName} className="hover:bg-bg-elevated/50">
                    <td className="p-3">
                      <Badge variant={tierData.color as any}>{tierName}</Badge>
                    </td>
                    <td className="p-3 text-center font-bold">{tierData.points}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {tierData[selectedRankView].map((gift, idx) => (
                          <span key={idx} className="px-2 py-1 bg-bg-elevated rounded-lg text-xs text-text-secondary">
                            {gift}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gift Descriptions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-bg rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue" />
            </div>
            <div>
              <CardTitle>Gift Beschrijvingen</CardTitle>
              <p className="text-sm text-text-muted">Details van alle beschikbare geschenken</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(GIFT_DESCRIPTIONS).map(([name, description]) => (
              <div key={name} className="p-3 bg-bg-elevated rounded-xl">
                <p className="font-semibold text-text-primary text-sm">{name}</p>
                <p className="text-xs text-text-muted mt-1">{description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className="mb-6">
        <CardHeader>
          <button 
            onClick={() => setShowRules(!showRules)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-bg rounded-xl flex items-center justify-center">
                <Info className="w-5 h-5 text-warning" />
              </div>
              <div>
                <CardTitle>Voorwaarden Smart SN Incentives</CardTitle>
                <p className="text-sm text-text-muted">Klik om de volledige voorwaarden te bekijken</p>
              </div>
            </div>
            {showRules ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
          </button>
        </CardHeader>
        {showRules && (
          <CardContent>
            <div className="space-y-4 text-sm text-text-secondary">
              <div>
                <h4 className="font-semibold text-text-primary mb-2">1. Gift</h4>
                <p>Exclusief beschikbaar voor consultants met de positie BC, SC of EC op de eerste dag van de incentive-periode.</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">2. Cash Bonus</h4>
                <p>Exclusief beschikbaar voor consultants vanaf de positie PC op de eerste dag van de incentive-periode.</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">3. Seminar</h4>
                <p>De kwaliteitsnormen met betrekking tot het Clawback-percentage zijn alleen van toepassing indien minstens 70% van je punten afkomstig zijn van je persoonlijke producten en diensten. De bonus wordt pas op het einde van het betreffende kwartaal toegevoegd op basis van je Clawback ratio op de laatste 6 maanden.</p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-2">4. Expert Group</h4>
                <p>De consultant moet lid zijn van een Expert Group tijdens het betreffende kwartaal.</p>
              </div>
              <div className="p-3 bg-bg-elevated rounded-xl">
                <p className="text-xs text-text-muted">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Van 01/01/2026 tot 31/03/2026 kun je punten verzamelen om een Gift te kiezen (t.e.m. Silver) of een Cash Bonus te krijgen (vanaf PC), volgens het puntensysteem in de onderstaande tabellen, gebaseerd op zowel de activatie van diensten als het bouwen van een team.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* PQS Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle>Personal Quick Start (PQS)</CardTitle>
                  <p className="text-sm text-text-muted">Jouw eerste doel als nieuwe consultant</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* PQS Status */}
              <div className={`p-4 rounded-xl mb-6 ${
                USER_DATA.pqsAchieved 
                  ? 'bg-success-bg border border-success/20' 
                  : 'bg-warning-bg border border-warning/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      USER_DATA.pqsAchieved ? 'bg-success' : 'bg-warning'
                    }`}>
                      {USER_DATA.pqsAchieved ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Lock className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {USER_DATA.pqsAchieved ? 'PQS Behaald!' : 'PQS in Progress'}
                      </p>
                      <p className="text-sm text-text-muted">
                        {USER_DATA.pqsAchieved 
                          ? 'Eenmalige prestatie voltooid' 
                          : `${PQS_INFO.requiredASP} ASP vereist in ${PQS_INFO.deadlineDays} dagen`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={USER_DATA.pqsAchieved ? 'green' : 'neutral'}>
                    {USER_DATA.pqsAchieved ? '✓ Permanent' : 'Actief'}
                  </Badge>
                </div>
              </div>

              {/* PQS Rewards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-accent-glow rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-5 h-5 text-accent" />
                    <span className="font-medium text-text-primary">Cash Bonus</span>
                  </div>
                  <p className="text-3xl font-bold text-accent">€{PQS_INFO.bonus}</p>
                </div>
                <div className="p-4 bg-purple-bg rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-purple" />
                    <span className="font-medium text-text-primary">Punten</span>
                  </div>
                  <p className="text-3xl font-bold text-purple">+{PQS_INFO.points}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unlocked Gifts */}
          {unlockedTiers.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center">
                    <Gift className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <CardTitle>Beschikbare Gifts ({USER_DATA.rank})</CardTitle>
                    <p className="text-sm text-text-muted">Kies je beloning uit ontgrendelde tiers</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {unlockedTiers.map(([tierName, tierData]) => (
                    <div key={tierName} className="p-4 bg-bg-elevated rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={tierData.color as any}>{tierName}</Badge>
                          <span className="text-sm text-text-muted">{tierData.points} punten</span>
                        </div>
                        <Button size="sm" onClick={() => handleTierClick(tierName)}>
                          Kies Gift
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tierData[USER_DATA.rank]?.slice(0, 3).map((gift, idx) => (
                          <span key={idx} className="px-2 py-1 bg-bg-surface rounded-lg text-xs text-text-secondary">
                            {gift}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Tiers Ontgrendeld</p>
              <p className="text-2xl font-bold text-success">{unlockedTiers.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Volgende Tier</p>
              <p className="text-2xl font-bold text-accent">
                {nextTier ? nextTier[1].points - USER_DATA.totalPoints : 0}
              </p>
              <p className="text-xs text-text-muted">punten nodig</p>
            </Card>
          </div>

          {/* How it Works */}
          <Card className="bg-accent-glow border-accent/20">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-accent">Hoe Werkt Het</h3>
              </div>
              <ul className="text-sm text-text-secondary space-y-2">
                <li>• Verzamel ASP punten door verkoop</li>
                <li>• Ontgrendel tiers bij 75, 100, 150, 225, 325, 400, 500 punten</li>
                <li>• Hogere ranks krijgen betere cash bonussen bij PLATINUM+</li>
                <li>• Kies je favoriete gift wanneer een tier ontgrendeld is</li>
                <li>• Gifts worden uitgereikt aan het einde van het kwartaal</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gift Selection Modal */}
      {showGiftModal && selectedTierData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGiftModal(false)} />
          <div className="relative w-full max-w-lg bg-bg-surface rounded-2xl shadow-modal border border-border-strong p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="h3">Kies Je Gift</h3>
                <p className="text-text-muted">{selectedTier} Tier • {selectedTierData.points} punten</p>
              </div>
              <button 
                onClick={() => setShowGiftModal(false)}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <Badge variant="purple" className="mb-2">Jouw Rank: {USER_DATA.rank}</Badge>
              <p className="text-sm text-text-muted">
                Beschikbare gifts voor je huidige rank:
              </p>
            </div>

            <div className="space-y-3">
              {availableGifts.map((gift, idx) => (
                <button
                  key={idx}
                  className="w-full p-4 bg-bg-elevated hover:bg-bg-overlay rounded-xl text-left transition-colors border-2 border-transparent hover:border-accent/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-glow rounded-xl flex items-center justify-center">
                      <Gift className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{gift}</p>
                      <p className="text-sm text-text-muted">Optie {idx + 1}</p>
                      {GIFT_DESCRIPTIONS[gift.split(' ')[0] + ' ' + gift.split(' ')[1]] && (
                        <p className="text-xs text-text-muted mt-1">
                          {GIFT_DESCRIPTIONS[gift.split(' ')[0] + ' ' + gift.split(' ')[1]]}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-text-muted text-center">
                Gift wordt toegekend aan het einde van het kwartaal
              </p>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
