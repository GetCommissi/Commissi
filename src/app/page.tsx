'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { 
  Zap, 
  TrendingUp, 
  Users, 
  Shield, 
  Calculator,
  Gift,
  Wallet,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Phone,
  FileText,
  Target,
  ArrowRight,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// COMMISSI LANDING + LOGIN PAGE
// Mobile-First Design
// ============================================

const FEATURES = [
  {
    icon: Calculator,
    title: 'Commission Calculator',
    description: 'Calculate exact commissions and track your earnings',
    color: 'from-teal-500 to-teal-700',
    stats: '€500+ avg. commission'
  },
  {
    icon: Gift,
    title: 'Incentives & Rewards',
    description: 'Volg je PQS, kwartaal gifts en behaal elke rank',
    color: 'from-purple-500 to-blue-500',
    stats: 'Track all rank progressions'
  },
  {
    icon: Wallet,
    title: 'Passief Inkomen',
    description: 'Fidelity commissies voor alle actieve klanten',
    color: 'from-green-500 to-emerald-500',
    stats: 'Monthly payouts'
  },
  {
    icon: Shield,
    title: 'Clawback Bescherming',
    description: 'Track je commissie veiligheid en opvolgcalls',
    color: 'from-blue-500 to-cyan-500',
    stats: 'Risk monitoring'
  }
];

const TESTIMONIALS = [
  {
    name: 'Sophie W.',
    role: 'Business Consultant',
    text: 'Commissi heeft mijn business getransformeerd. De calculator bespaart me uren per dag!',
    avatar: 'S'
  },
  {
    name: 'Mark D.',
    role: 'Senior Consultant',
    text: 'De incentives tracking motiveert me elke dag om mijn targets te halen.',
    avatar: 'M'
  },
  {
    name: 'Lisa V.',
    role: 'Executive Consultant',
    text: 'Fidelity overzicht is onmisbaar. Ik zie exact wat ik elke maand aan passief inkomen krijg.',
    avatar: 'L'
  }
];

export default function LandingLoginPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (result?.error) {
      setError('Ongeldige inloggegevens');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1419]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0F1419]/95 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-white text-lg lg:text-xl hidden sm:block">Commissi</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('calculator')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Calculator
              </button>
              <button onClick={() => scrollToSection('incentives')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Incentives
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Reviews
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowLogin(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                Inloggen
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-teal-500/25 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#0F1419]/98 backdrop-blur-lg border-b border-white/5">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-3 text-gray-300 hover:text-white border-b border-white/5">
                Features
              </button>
              <button onClick={() => scrollToSection('calculator')} className="block w-full text-left py-3 text-gray-300 hover:text-white border-b border-white/5">
                Calculator
              </button>
              <button onClick={() => scrollToSection('incentives')} className="block w-full text-left py-3 text-gray-300 hover:text-white border-b border-white/5">
                Incentives
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-3 text-gray-300 hover:text-white border-b border-white/5">
                Reviews
              </button>
              <button 
                onClick={() => {
                  setShowLogin(true);
                  setIsMenuOpen(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-semibold mt-4"
              >
                Inloggen
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogin(false)} />
          <div className="relative w-full max-w-md bg-[#1A1F28] rounded-2xl border border-white/10 p-6 sm:p-8 animate-in">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welkom terug</h2>
              <p className="text-gray-400 text-sm">Log in om je dashboard te zien</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-[#252D3A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wachtwoord</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#252D3A] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 text-sm font-medium">Commission Management Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Maximize your{' '}
                <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                  sales performance
                </span>
              </h1>

              <p className="text-lg text-teal-400 mb-6">
                Your commissions. Your team. Crystal clear.
              </p>

              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                De complete tool voor Business Consultants. Bereken commissies, 
                track incentives en bouw je passief inkomen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => setShowLogin(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollToSection('features')}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Ontdek Features
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/5">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">Track</p>
                  <p className="text-sm text-gray-400 mt-1">All commissions</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">Manage</p>
                  <p className="text-sm text-gray-400 mt-1">Your team</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">Grow</p>
                  <p className="text-sm text-gray-400 mt-1">Your business</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-[#1A1F28] to-[#252D3A] rounded-3xl border border-white/10 p-8 shadow-2xl">
                {/* Mock Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl" />
                      <div>
                        <p className="text-white font-semibold">Dashboard</p>
                        <p className="text-gray-400 text-sm">Welkom terug!</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">Live</div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0F1419] rounded-xl p-4">
                      <p className="text-gray-400 text-sm">Deze Maand</p>
                      <p className="text-2xl font-bold text-white mt-1">€2,396</p>
                      <p className="text-green-400 text-xs mt-1">+12%</p>
                    </div>
                    <div className="bg-[#0F1419] rounded-xl p-4">
                      <p className="text-gray-400 text-sm">PQS Status</p>
                      <p className="text-2xl font-bold text-white mt-1">ACTIEF</p>
                      <p className="text-blue-400 text-xs mt-1">50 pts</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 bg-gradient-to-r from-teal-500/20 to-teal-700/20 rounded-lg p-3 text-center">
                      <Calculator className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                      <p className="text-white text-xs">Calculator</p>
                    </div>
                    <div className="flex-1 bg-[#0F1419] rounded-lg p-3 text-center">
                      <Gift className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-white text-xs">Incentives</p>
                    </div>
                    <div className="flex-1 bg-[#0F1419] rounded-lg p-3 text-center">
                      <Wallet className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <p className="text-white text-xs">Fidelity</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 shadow-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-3 shadow-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-[#0F1419]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Alles wat je nodig hebt
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A complete suite of tools to take your sales team to the next level
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <div 
                key={idx}
                className="group bg-[#1A1F28] rounded-2xl border border-white/5 p-6 hover:border-teal-500/30 transition-all hover:transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <p className={`text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.stats}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Preview Section */}
      <section id="calculator" className="py-16 lg:py-24 bg-[#1A1F28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-[#0F1419] rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Internet Zen + 2x Medium</span>
                  <span className="text-white font-semibold">€58/maand</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Commissie Internet</span>
                  <span className="text-green-400 font-semibold">+€15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Commissie Mobile (2x)</span>
                  <span className="text-green-400 font-semibold">+€70</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Convergentie Bonus</span>
                  <span className="text-green-400 font-semibold">+€27</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">Totale Commissie</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">
                      €112
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-full mb-6">
                <Calculator className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 text-sm font-medium">Commission Calculator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Bereken exacte prijzen en commissies
              </h2>
              <p className="text-gray-400 mb-6">
                Met live Orange tarieven. Zie direct wat je klant betaalt en wat jij verdient. 
                Inclusief alle bonussen: convergentie, nummerbehoud, SoHo en meer.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Actuele Orange prijzen (zonder promoties)',
                  'Automatische commissie berekening',
                  'Convergentie en bonus tracking',
                  'Directe offerte generatie'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="w-3 h-3 text-green-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300 transition-colors"
              >
                Probeer de calculator
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Incentives Section */}
      <section id="incentives" className="py-16 lg:py-24 bg-[#0F1419]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Gift className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-medium">Incentives & Rewards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Bereik elke rank, verdien elke reward
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Van PQS tot Diamond Club. Volg je voortgang en claim je gifts.
            </p>
          </div>

          {/* Gift Tiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
            {[
              { name: 'Iron', points: 75, color: 'from-gray-400 to-gray-600' },
              { name: 'Bronze', points: 100, color: 'from-orange-400 to-orange-600' },
              { name: 'Silver', points: 150, color: 'from-gray-300 to-gray-500' },
              { name: 'Gold', points: 225, color: 'from-yellow-400 to-yellow-600' },
              { name: 'Platinum', points: 325, color: 'from-cyan-400 to-cyan-600' },
              { name: 'Sapphire', points: 400, color: 'from-blue-400 to-blue-600' },
              { name: 'Diamond', points: 500, color: 'from-purple-400 to-purple-600' },
            ].map((tier, idx) => (
              <div 
                key={idx}
                className="bg-[#1A1F28] rounded-xl border border-white/5 p-4 text-center hover:border-white/10 transition-all"
              >
                <div className={`w-10 h-10 mx-auto bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center mb-2`}>
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <p className="text-white font-semibold text-sm">{tier.name}</p>
                <p className="text-gray-400 text-xs">{tier.points} pts</p>
              </div>
            ))}
          </div>

          {/* PQS Card */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Personal Quick Start (PQS)</h3>
                <p className="text-blue-100 mb-6">
                  Je eerste doel als nieuwe consultant. Behaal 12 ASP binnen 40 dagen en 
                  ontvang €150 cash bonus + 50 gift punten.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-white/10 rounded-lg">
                    <p className="text-2xl font-bold">€150</p>
                    <p className="text-xs text-blue-200">Cash Bonus</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-lg">
                    <p className="text-2xl font-bold">+50</p>
                    <p className="text-xs text-blue-200">Gift Punten</p>
                  </div>
                  <div className="px-4 py-2 bg-white/10 rounded-lg">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-blue-200">ASP Nodig</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-4">Vereisten</h4>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Minstens 7 ASP uit mobiele telefonie
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Minstens 3 ASP uit energie
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    Minstens 2 ASP uit internet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 lg:py-24 bg-[#1A1F28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Wat consultants zeggen
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={idx} className="bg-[#0F1419] rounded-2xl border border-white/5 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#0F1419]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Klaar om je business te groeien?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of sales professionals who use Commissi to 
            maximize their results. Free to get started.
          </p>
          <button 
            onClick={() => setShowLogin(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-teal-500/25 transition-all"
          >
            <Zap className="w-5 h-5" />
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1419] border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">Commissi</span>
              </div>
              <p className="text-gray-400 text-sm">
                The complete commission management platform for sales teams.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white">Features</button></li>
                <li><button onClick={() => scrollToSection('calculator')} className="hover:text-white">Calculator</button></li>
                <li><button onClick={() => scrollToSection('incentives')} className="hover:text-white">Incentives</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white cursor-pointer">Contact</span></li>
                <li><span className="hover:text-white cursor-pointer">Status</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><span className="hover:text-white cursor-pointer">Privacy</span></li>
                <li><span className="hover:text-white cursor-pointer">Terms</span></li>
                <li><span className="hover:text-white cursor-pointer">GDPR</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-gray-400 text-sm">
            © 2025 Commissi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
