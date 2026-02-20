import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Activity type definition
interface Activity {
  id: string;
  type: 'call' | 'offer' | 'lead' | 'sale';
  title: string;
  time: string;
  status: 'success' | 'pending' | 'new' | 'warning';
}

// GET /api/activity - Get recent activity feed
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const consultantId = session.user.id;

    // Fetch recent CallLogs (last 10, ordered by createdAt desc)
    const recentCalls = await prisma.callLog.findMany({
      where: {
        consultantId,
      },
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
          },
        },
      },
      orderBy: {
        calledAt: 'desc',
      },
      take: 10,
    });

    // Fetch recent Offers (last 10, ordered by createdAt desc)
    const recentOffers = await prisma.offer.findMany({
      where: {
        consultantId,
      },
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Fetch recent Leads (last 10, ordered by createdAt desc)
    const recentLeads = await prisma.lead.findMany({
      where: {
        ownerId: consultantId,
      },
      select: {
        id: true,
        companyName: true,
        contactName: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Fetch recent Sales (last 10, ordered by createdAt desc)
    const recentSales = await prisma.sale.findMany({
      where: {
        consultantId,
      },
      include: {
        lead: {
          select: {
            companyName: true,
            contactName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Map CallLogs to activities
    const callActivities: Activity[] = recentCalls.map((call) => {
      let status: 'success' | 'pending' | 'new' | 'warning' = 'new';
      if (call.result === 'SALE') {
        status = 'success';
      } else if (call.result === 'INTERESTED' || call.result === 'QUOTED') {
        status = 'pending';
      } else if (call.result === 'NOT_INTERESTED') {
        status = 'warning';
      }

      const leadName = call.lead?.companyName || call.lead?.contactName || 'Unknown';

      return {
        id: `call-${call.id}`,
        type: 'call',
        title: `Call with ${leadName} - ${call.result}`,
        time: call.calledAt.toISOString(),
        status,
      };
    });

    // Map Offers to activities
    const offerActivities: Activity[] = recentOffers.map((offer) => {
      let status: 'success' | 'pending' | 'new' | 'warning' = 'new';
      if (offer.status === 'ACCEPTED' || offer.status === 'SOLD') {
        status = 'success';
      } else if (offer.status === 'SENT') {
        status = 'pending';
      } else if (offer.status === 'REJECTED' || offer.status === 'EXPIRED') {
        status = 'warning';
      }

      const leadName = offer.lead?.companyName || offer.lead?.contactName || 'Unknown';

      return {
        id: `offer-${offer.id}`,
        type: 'offer',
        title: `Offer for ${leadName} - ${offer.status}`,
        time: offer.createdAt.toISOString(),
        status,
      };
    });

    // Map Leads to activities
    const leadActivities: Activity[] = recentLeads.map((lead) => {
      let status: 'success' | 'pending' | 'new' | 'warning' = 'new';
      if (lead.status === 'SALE_MADE') {
        status = 'success';
      } else if (lead.status === 'CONTACTED' || lead.status === 'QUOTED') {
        status = 'pending';
      } else if (lead.status === 'NOT_INTERESTED') {
        status = 'warning';
      }

      const leadName = lead.companyName || lead.contactName || 'Unknown';

      return {
        id: `lead-${lead.id}`,
        type: 'lead',
        title: `New lead: ${leadName}`,
        time: lead.createdAt.toISOString(),
        status,
      };
    });

    // Map Sales to activities
    const saleActivities: Activity[] = recentSales.map((sale) => {
      let status: 'success' | 'pending' | 'new' | 'warning' = 'pending';
      if (sale.status === 'COMPLETED' || sale.status === 'ACTIVE') {
        status = 'success';
      } else if (sale.status === 'PENDING') {
        status = 'pending';
      } else if (sale.status === 'CANCELLED') {
        status = 'warning';
      }

      const leadName = sale.lead?.companyName || sale.lead?.contactName || 'Unknown';

      return {
        id: `sale-${sale.id}`,
        type: 'sale',
        title: `Sale for ${leadName} - ${sale.status}`,
        time: sale.createdAt.toISOString(),
        status,
      };
    });

    // Combine all activities and sort by time (newest first)
    const allActivities: Activity[] = [
      ...callActivities,
      ...offerActivities,
      ...leadActivities,
      ...saleActivities,
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      activities: allActivities,
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    );
  }
}
