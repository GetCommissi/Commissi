// ============================================
// SMART SN COMMISSION ENGINE
// Complete commission calculation system
// ============================================

export type Rank = 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';

// Commission rates per rank
export const MOBILE_COMMISSION: Record<string, Record<Rank, number>> = {
  'Child':     { BC: 1,   SC: 5,   EC: 5,   PC: 5,   MC: 5,   NMC: 5,   PMC: 5 },
  'Small':     { BC: 10,  SC: 15,  EC: 15,  PC: 15,  MC: 15,  NMC: 15,  PMC: 15 },
  'Medium':    { BC: 35,  SC: 40,  EC: 40,  PC: 40,  MC: 40,  NMC: 40,  PMC: 40 },
  'Large':     { BC: 50,  SC: 55,  EC: 55,  PC: 55,  MC: 55,  NMC: 55,  PMC: 55 },
  'Unlimited': { BC: 60,  SC: 65,  EC: 65,  PC: 65,  MC: 65,  NMC: 65,  PMC: 65 },
};

// Bonuses for mobile
export const MOBILE_BONUSES = {
  convergence: 12,      // +€12 for Medium+ when with internet
  portability: 20,      // +€20 for Medium+ when number portability
  soho: 15,            // +€15 for Medium+ when SOHO
};

// Internet & TV commissions
export const INTERNET_COMMISSION: Record<Rank, number> = {
  BC: 15, SC: 20, EC: 20, PC: 20, MC: 20, NMC: 20, PMC: 20
};

export const INTERNET_BONUSES = {
  convergence: 15,      // +€15 when with mobile
  portability: 12,      // +€12 Easy Switch
};

export const TV_COMMISSION: Record<Rank, number> = {
  BC: 10, SC: 10, EC: 10, PC: 10, MC: 10, NMC: 10, PMC: 10
};

// Energy commissions
export const ENERGY_COMMISSION: Record<string, Record<Rank, number>> = {
  'Residential': { BC: 20, SC: 25, EC: 25, PC: 25, MC: 25, NMC: 25, PMC: 25 },
  'SoHo':        { BC: 40, SC: 45, EC: 45, PC: 45, MC: 45, NMC: 45, PMC: 45 },
  'Maintenance': { BC: 20, SC: 25, EC: 25, PC: 25, MC: 25, NMC: 25, PMC: 25 },
};

// Upline commission percentages (level 1-7)
export const UPLINE_PERCENTAGES = [0.10, 0.05, 0.03, 0.03, 0.02, 0.01, 0.01];

// Fidelity commissions (monthly, per service)
export const FIDELITY_RATES: Record<string, Record<Rank, number>> = {
  'Internet':        { BC: 0.35, SC: 0.35, EC: 0.35, PC: 0.35, MC: 0.35, NMC: 0.35, PMC: 0.35 },
  'Energy':          { BC: 0.35, SC: 0.35, EC: 0.35, PC: 0.35, MC: 0.35, NMC: 0.35, PMC: 0.35 },
  'Mobile Child':    { BC: 0.25, SC: 0.25, EC: 0.25, PC: 0.25, MC: 0.25, NMC: 0.25, PMC: 0.25 },
  'Mobile Small':    { BC: 0.50, SC: 0.50, EC: 0.50, PC: 0.50, MC: 0.50, NMC: 0.50, PMC: 0.50 },
  'Mobile Medium':   { BC: 1.00, SC: 1.00, EC: 1.00, PC: 1.00, MC: 1.00, NMC: 1.00, PMC: 1.00 },
  'Mobile Large':    { BC: 1.25, SC: 1.25, EC: 1.25, PC: 1.25, MC: 1.25, NMC: 1.25, PMC: 1.25 },
  'Mobile Unlimited':{ BC: 1.50, SC: 1.50, EC: 1.50, PC: 1.50, MC: 1.50, NMC: 1.50, PMC: 1.50 },
  'Go Light':        { BC: 0.40, SC: 0.40, EC: 0.40, PC: 0.40, MC: 0.40, NMC: 0.40, PMC: 0.40 },
  'Go Plus':         { BC: 0.80, SC: 0.80, EC: 0.80, PC: 0.80, MC: 0.80, NMC: 0.80, PMC: 0.80 },
  'Go Intense':      { BC: 1.00, SC: 1.00, EC: 1.00, PC: 1.00, MC: 1.00, NMC: 1.00, PMC: 1.00 },
  'Go Extreme':      { BC: 1.75, SC: 1.75, EC: 1.75, PC: 1.75, MC: 1.75, NMC: 1.75, PMC: 1.75 },
};

// Upline Fidelity percentages per level (level 0-7)
export const UPLINE_FIDELITY_PERCENTAGES: Record<string, number[]> = {
  'Internet':         [1.00, 0.43, 0.14, 0.14, 0.14, 0.14, 0.14, 0.57],
  'Energy':           [1.00, 0.43, 0.14, 0.14, 0.14, 0.14, 0.14, 0.57],
  'Mobile Child':     [0.50, 0.21, 0.07, 0.07, 0.07, 0.07, 0.07, 0.29],
  'Mobile Small':     [1.00, 0.43, 0.14, 0.14, 0.14, 0.14, 0.14, 0.57],
  'Mobile Medium':    [1.60, 0.64, 0.21, 0.21, 0.21, 0.21, 0.21, 0.89],
  'Mobile Large':     [1.25, 0.53, 0.17, 0.17, 0.17, 0.17, 0.17, 0.73],
  'Mobile Unlimited': [1.50, 0.64, 0.21, 0.21, 0.21, 0.21, 0.21, 0.89],
  'Go Light':         [0.40, 0.17, 0.06, 0.06, 0.06, 0.06, 0.06, 0.23],
  'Go Plus':          [0.80, 0.34, 0.11, 0.11, 0.11, 0.11, 0.11, 0.46],
  'Go Intense':       [1.00, 0.43, 0.14, 0.14, 0.14, 0.14, 0.14, 0.57],
  'Go Extreme':       [1.75, 0.75, 0.25, 0.25, 0.25, 0.25, 0.25, 1.00],
  'EasyInternet@Home':[0.50, 0.21, 0.07, 0.07, 0.07, 0.07, 0.07, 0.29],
};

// Clawback rules
export const CLAWBACK_RULES = {
  lessThan1Month: 0,      // 0% - full clawback
  oneTo6Months: 0.25,     // 25% - keep 25%
  moreThan6Months: 0.75,  // 75% - keep 75%
};

export interface SaleItem {
  id: string;
  type: 'mobile' | 'internet' | 'tv' | 'energy';
  product: string;
  rank: Rank;
  hasConvergence?: boolean;
  hasPortability?: boolean;
  isSoHo?: boolean;
  date: Date;
  consultantLevel?: number; // for upline (1-7)
}

export interface CommissionBreakdown {
  base: number;
  convergenceBonus: number;
  portabilityBonus: number;
  sohoBonus: number;
  total: number;
}

export interface FidelityBreakdown {
  monthly: number;
  uplineLevel: number;
  uplineAmount: number;
}

// Calculate personal commission
export function calculatePersonalCommission(
  item: SaleItem
): CommissionBreakdown {
  let base = 0;
  let convergenceBonus = 0;
  let portabilityBonus = 0;
  let sohoBonus = 0;

  if (item.type === 'mobile') {
    base = MOBILE_COMMISSION[item.product]?.[item.rank] || 0;
    
    // Only Medium+ get bonuses
    if (['Medium', 'Large', 'Unlimited'].includes(item.product)) {
      if (item.hasConvergence) convergenceBonus = MOBILE_BONUSES.convergence;
      if (item.hasPortability) portabilityBonus = MOBILE_BONUSES.portability;
      if (item.isSoHo) sohoBonus = MOBILE_BONUSES.soho;
    }
  } else if (item.type === 'internet') {
    base = INTERNET_COMMISSION[item.rank];
    if (item.hasConvergence) convergenceBonus = INTERNET_BONUSES.convergence;
    if (item.hasPortability) portabilityBonus = INTERNET_BONUSES.portability;
  } else if (item.type === 'tv') {
    base = TV_COMMISSION[item.rank];
  } else if (item.type === 'energy') {
    base = ENERGY_COMMISSION[item.product]?.[item.rank] || 0;
  }

  return {
    base,
    convergenceBonus,
    portabilityBonus,
    sohoBonus,
    total: base + convergenceBonus + portabilityBonus + sohoBonus,
  };
}

// Calculate upline commission
export function calculateUplineCommission(
  downlineCommission: number,
  level: number // 1-7
): number {
  if (level < 1 || level > 7) return 0;
  const percentage = UPLINE_PERCENTAGES[level - 1];
  return downlineCommission * percentage;
}

// Calculate fidelity
export function calculateFidelity(
  serviceType: string,
  rank: Rank
): number {
  return FIDELITY_RATES[serviceType]?.[rank] || 0;
}

// Calculate upline fidelity
export function calculateUplineFidelity(
  personalFidelity: number,
  serviceType: string,
  level: number // 0-7
): number {
  const percentages = UPLINE_FIDELITY_PERCENTAGES[serviceType];
  if (!percentages || level < 0 || level > 7) return 0;
  return personalFidelity * (percentages[level] / 100);
}

// Calculate clawback
export function calculateClawback(
  commission: number,
  saleDate: Date
): { keepAmount: number; clawbackAmount: number; percentage: number } {
  const now = new Date();
  const monthsDiff = (now.getFullYear() - saleDate.getFullYear()) * 12 + 
    (now.getMonth() - saleDate.getMonth());
  
  let keepPercentage = 0;
  
  if (monthsDiff < 1) {
    keepPercentage = CLAWBACK_RULES.lessThan1Month;
  } else if (monthsDiff < 6) {
    keepPercentage = CLAWBACK_RULES.oneTo6Months;
  } else {
    keepPercentage = CLAWBACK_RULES.moreThan6Months;
  }
  
  const keepAmount = commission * keepPercentage;
  const clawbackAmount = commission - keepAmount;
  
  return {
    keepAmount,
    clawbackAmount,
    percentage: keepPercentage,
  };
}

// ASP (Active Sales Points) - used for quarter incentives
// These points accumulate for gift tiers (75, 100, 150, 225, 325, 400, 500)
export const ASP_RATES: Record<string, number> = {
  // Mobile plans
  'Child': 0.25,
  'Small': 0.50,
  'Medium': 1.00,
  'Large': 1.25,
  'Unlimited': 1.50,
  // Internet
  'Start': 1.00,
  'Zen': 1.00,
  'Giga': 1.00,
  // TV
  'TV Life': 0.50,
  'TV': 1.00,
  'TV Plus': 1.00,
  // Energy
  'Residential': 1.00,
  'SoHo': 2.00,
  'Maintenance': 1.00,
};

// Calculate ASP points for a sale
export function calculateASP(
  items: Array<{ type: string; product: string }>
): number {
  return items.reduce((total, item) => {
    // Find matching ASP rate
    const rate = ASP_RATES[item.product] || ASP_RATES[item.type] || 0;
    return total + rate;
  }, 0);
}

// Calculate ASP for a single item
export function calculateItemASP(type: string, product: string): number {
  return ASP_RATES[product] || ASP_RATES[type] || 0;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
