// Demo data for testing without database
export const DEMO_USER = {
  id: 'demo-1',
  email: 'test@test.com',
  name: 'Lenny De K.',
  role: 'USER',
  status: 'ACTIVE',
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DEMO_LEADS = [
  {
    id: '1',
    companyName: 'Willems Groep',
    contactName: 'Sophie Willems',
    email: 'sophie@willemsgroep.be',
    phone: '+32 471 23 45 67',
    city: 'Mechelen',
    status: 'QUALIFIED',
    source: 'Referral',
    notes: 'Interesse in Internet + 2 mobile lines',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date(),
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Peeters',
    email: 'jan@techsolutions.be',
    phone: '+32 489 12 34 56',
    city: 'Brussel',
    status: 'OFFER_SENT',
    source: 'Website',
    notes: 'Grote onderneming, 10+ lijnen nodig',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    email: 'maria@lekkernij.be',
    phone: '+32 495 67 89 01',
    city: 'Aalst',
    status: 'NEW',
    source: 'Cold Call',
    notes: 'Kleine zaak, budget beperkt',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    companyName: 'NecmiCuts',
    contactName: 'Necmi Yildiz',
    email: 'necmi@necmicuts.be',
    phone: '+32 478 90 12 34',
    city: 'Antwerpen',
    status: 'WON',
    source: 'Referral',
    notes: 'Tevreden klant, aanbeveling gedaan',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date(),
  },
  {
    id: '5',
    companyName: 'Constructie Groep',
    contactName: 'Luc Martens',
    email: 'luc@constructiegroep.be',
    phone: '+32 486 54 32 10',
    city: 'Gent',
    status: 'CONTACTED',
    source: 'Event',
    notes: 'Follow-up gepland volgende week',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date(),
  },
];

export const DEMO_STATS = {
  totalLeads: 156,
  newLeads: 12,
  totalCalls: 48,
  todayCalls: 8,
  totalOffers: 23,
  pendingOffers: 8,
  commissionMonth: 18650,
  commissionYear: 89450,
  trend: '+12%',
};

export const DEMO_COMMISSIONS = [
  { id: '1', client: 'Bakkerij De Lekkernij', amount: 186, status: 'PAID', date: '2025-02-10', products: ['Internet Zen', '2x Medium', 'TV+'] },
  { id: '2', client: 'Tech Solutions BV', amount: 520, status: 'PAID', date: '2025-01-15', products: ['Internet Giga', 'Unlimited', 'TV Life'] },
  { id: '3', client: 'NecmiCuts', amount: 240, status: 'PAID', date: '2024-08-20', products: ['Internet Start', 'Small'] },
  { id: '4', client: 'Constructie Groep', amount: 450, status: 'PENDING', date: '2025-01-05', products: ['Internet Zen', '2x Large'] },
  { id: '5', client: 'Fashion Store', amount: 320, status: 'PAID', date: '2025-02-01', products: ['Internet Start', 'Medium'] },
  { id: '6', client: 'Dental Care Plus', amount: 680, status: 'PAID', date: '2024-09-10', products: ['Internet Giga', '3x Unlimited', 'TV+'] },
];

export const DEMO_FIDELITY = [
  { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters', monthlyCommission: 12.50, contractDuration: 14 },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen', monthlyCommission: 28.00, contractDuration: 11 },
  { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz', monthlyCommission: 8.50, contractDuration: 8 },
  { id: '4', companyName: 'Fashion Store', contactName: 'Lisa Dubois', monthlyCommission: 6.75, contractDuration: 6 },
  { id: '5', companyName: 'Café Central', contactName: 'Pierre Martin', monthlyCommission: 15.25, contractDuration: 12 },
];

export const DEMO_PIPELINE = [
  { stage: 'Leads', count: 156, value: 0 },
  { stage: 'Gecontacteerd', count: 89, value: 0 },
  { stage: 'Offertes Verstuurd', count: 23, value: 8540 },
  { stage: 'Onderhandeling', count: 8, value: 4200 },
  { stage: 'Afronding', count: 4, value: 2100 },
];
