import { NextResponse } from 'next/server';
import { DEMO_LEADS } from '@/lib/demo-data';
import { Prisma } from '@prisma/client';

// Type for Lead where clause
type LeadWhereInput = Prisma.LeadWhereInput;

// Type for Lead create input
type LeadCreateInput = Prisma.LeadCreateInput;

// Return type for Lead (serialized)
interface LeadResponse {
  id: string;
  companyName: string;
  contactName?: string | null;
  email?: string | null;
  phone: string;
  city?: string | null;
  status: string;
  source?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    // Try database first
    try {
      const { prisma } = await import('@/lib/prisma');
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(leads);
    } catch (dbError) {
      // Return demo data if database fails
      return NextResponse.json(DEMO_LEADS);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    try {
      const { prisma } = await import('@/lib/prisma');
      const lead = await prisma.lead.create({ data: body });
      return NextResponse.json(lead);
    } catch (dbError) {
      // Return mock created lead
      return NextResponse.json({ ...body, id: 'new-' + Date.now() });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
