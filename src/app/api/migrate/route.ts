import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // SEC-2: Migrate endpoint is disabled - use CLI or CI/CD only
  return NextResponse.json(
    { 
      error: 'Migration endpoint is disabled. Use CLI: npx prisma migrate deploy',
      hint: 'Run migrations locally or via your deployment pipeline'
    },
    { status: 403 }
  );
}
