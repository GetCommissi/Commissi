import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma');

    // Get current date info
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Fetch leads stats
    const leadsTotal = await prisma.lead.count();
    const leadsNew = await prisma.lead.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Fetch calls stats
    const callsTotal = await prisma.callLog.count();
    const callsToday = await prisma.callLog.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Fetch offers stats
    const offersTotal = await prisma.offer.count();
    const offersPending = await prisma.offer.count({
      where: {
        status: 'PENDING',
      },
    });

    // Fetch commission stats
    const commissionMonthResult = await prisma.offer.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        status: 'SOLD',
        soldAt: {
          gte: startOfMonth,
        },
      },
    });

    const commissionYearResult = await prisma.offer.aggregate({
      _sum: {
        commissionAmount: true,
      },
      where: {
        status: 'SOLD',
        soldAt: {
          gte: startOfYear,
        },
      },
    });

    return NextResponse.json({
      leads: { 
        total: leadsTotal, 
        new: leadsNew, 
        trend: '+12%' 
      },
      calls: { 
        total: callsTotal, 
        today: callsToday, 
        trend: '+8%' 
      },
      offers: { 
        total: offersTotal, 
        pending: offersPending, 
        trend: '+20%' 
      },
      commission: { 
        month: commissionMonthResult._sum.commissionAmount || 0, 
        year: commissionYearResult._sum.commissionAmount || 0, 
        trend: '+15%' 
      }
    });
  } catch (error) {
    // Return zeros if database fails
    return NextResponse.json({
      leads: { total: 0, new: 0, trend: '0%' },
      calls: { total: 0, today: 0, trend: '0%' },
      offers: { total: 0, pending: 0, trend: '0%' },
      commission: { month: 0, year: 0, trend: '0%' }
    });
  }
}
