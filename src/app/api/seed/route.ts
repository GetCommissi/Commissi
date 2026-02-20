import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // SEC-1: Seed endpoint is disabled in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Seed endpoint is disabled in production' },
      { status: 403 }
    );
  }

  // Only allow in development with proper secret
  const secret = process.env.SEED_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Seed endpoint not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Use CLI for seeding: npx prisma db seed' },
    { status: 400 }
  );
}
