import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { calculateOfferCommission } from '@/lib/commission';
import { Prisma } from '@prisma/client';

// Product type for offer creation
interface OfferProduct {
  type: string;
  plan: string;
  retailValue: number;
  options?: Record<string, unknown>;
}

// Lead info included in offer response
interface LeadInfo {
  id: string;
  companyName: string;
  contactName?: string | null;
  city?: string | null;
  phone: string;
}

// Offer with lead info type
interface OfferWithLead {
  id: string;
  leadId: string;
  consultantId: string;
  products: string;
  totalRetail: number;
  totalASP: number;
  customerSavings: number;
  status: string;
  potentialCommission: number | null;
  effectiveCommission: number | null;
  sentAt: Date | null;
  acceptedAt: Date | null;
  soldAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lead: LeadInfo;
}

// Commission calculation result
interface CommissionCalc {
  potentialCommission: number;
  effectiveCommission: number;
}

// API response types
interface OffersResponse {
  offers: OfferWithLead[];
  totals: {
    potentialCommission: number;
    effectiveCommission: number;
    totalOffers: number;
    sentCount: number;
    acceptedCount: number;
  };
}

interface CreateOfferResponse {
  offer: OfferWithLead;
  commission: {
    potential: number;
    effective: number;
  };
}

// GET /api/offers - List offers for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const offers = await prisma.offer.findMany({
      where: {
        consultantId: session.user.id,
        ...(status && status !== 'ALL' ? { status } : {}),
      },
      include: {
        lead: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            city: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate commission totals
    const potentialCommission = offers
      .filter(o => o.status === 'SENT')
      .reduce((sum, o) => sum + (o.potentialCommission || 0), 0);
    
    const effectiveCommission = offers
      .filter(o => o.status === 'ACCEPTED')
      .reduce((sum, o) => sum + (o.effectiveCommission || 0), 0);

    return NextResponse.json({
      offers,
      totals: {
        potentialCommission,
        effectiveCommission,
        totalOffers: offers.length,
        sentCount: offers.filter(o => o.status === 'SENT').length,
        acceptedCount: offers.filter(o => o.status === 'ACCEPTED').length,
      },
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// POST /api/offers - Create new offer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, products, totalRetail, totalASP, customerSavings } = body;

    if (!leadId || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate commission preview (but don't assign yet - only when SENT)
    const { calculateOfferCommission } = await import('@/lib/commission');
    const commissionCalc = calculateOfferCommission(
      products.map((p: OfferProduct) => ({
        type: p.type,
        plan: p.plan,
        retailValue: p.retailValue,
        options: p.options || {},
      })),
      'BC' // Default to BC level
    );

    // Create offer (DRAFT status - no commission yet)
    const offer = await prisma.offer.create({
      data: {
        leadId,
        consultantId: session.user.id,
        products: JSON.stringify(products),
        totalRetail: totalRetail || 0,
        totalASP: totalASP || 0,
        customerSavings: customerSavings || 0,
        status: 'DRAFT',
        // Pre-calculate commission for preview
        potentialCommission: commissionCalc.potentialCommission,
      },
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
            city: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      offer,
      commission: {
        potential: commissionCalc.potentialCommission,
        effective: commissionCalc.effectiveCommission,
      }
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
