import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// SEC-6: Only ADMIN role can access this endpoint
async function checkAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  if (session.user.role !== 'ADMIN') {
    return { error: 'Forbidden - Admin access required', status: 403 };
  }
  
  return null;
}

// This endpoint fixes the database by removing duplicate camelCase columns
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin(request);
    if (adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error }, 
        { status: adminCheck.status }
      );
    }

    const results: string[] = [];

    // Helper function to check if column exists
    const columnExists = async (columnName: string): Promise<boolean> => {
      try {
        const result = await prisma.$queryRaw<{ column_name: string }[]>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'Lead' AND column_name = ${columnName}
        `;
        return result && result.length > 0;
      } catch {
        return false;
      }
    };

    // List of duplicate camelCase columns to remove (keeping lowercase versions)
    const columnsToRemove = [
      'contactName',      // keep contactname
      'postalCode',       // keep postalcode  
      'currentProvider',  // keep currentprovider
      'currentSupplier',  // keep currentsupplier
      'consentEmail',     // keep consentemail
      'consentPhone',     // keep consentphone
      'consentWhatsapp',  // keep consentwhatsapp
      'lawfulBasis',      // keep lawfulbasis
      'doNotCall',        // keep donotcall
      'gdprAcceptanceDate', // keep gdpracceptancedate
      'privacyPolicyVersion', // keep privacypolicyversion
      'createdAt',        // keep createdat
      'updatedAt',        // keep updatedat
      'companyName',      // keep companyname
      'phoneHash',        // keep phonehash
      'ownerId',          // keep ownerid
    ];

    for (const col of columnsToRemove) {
      const exists = await columnExists(col);
      if (exists) {
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" DROP COLUMN "${col}"`);
          results.push(`Removed duplicate column: ${col}`);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          results.push(`Failed to remove ${col}: ${errorMessage}`);
        }
      } else {
        results.push(`Column ${col} does not exist (already removed or never existed)`);
      }
    }

    // Add missing columns if needed
    const columnsToAdd = [
      { name: 'contactname', type: 'TEXT' },
      { name: 'ean', type: 'TEXT' },
    ];

    for (const col of columnsToAdd) {
      const exists = await columnExists(col.name);
      if (!exists) {
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Lead" ADD COLUMN "${col.name}" ${col.type}`);
          results.push(`Added missing column: ${col.name}`);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          results.push(`Failed to add ${col.name}: ${errorMessage}`);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database fix completed',
      results
    });

  } catch (error) {
    console.error('Database fix error:', error);
    // SEC-5: Sanitized error response
    return NextResponse.json({ 
      error: 'Failed to fix database'
    }, { status: 500 });
  }
}

// GET method to check current status
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await checkAdmin(request);
    if (adminCheck) {
      return NextResponse.json(
        { error: adminCheck.error }, 
        { status: adminCheck.status }
      );
    }

    // Get all columns in Lead table
    const columns = await prisma.$queryRaw<{ column_name: string }[]>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Lead'
      ORDER BY ordinal_position
    `;

    return NextResponse.json({
      columns: columns.map((c) => c.column_name),
      warning: 'Database has duplicate columns (both camelCase and lowercase). Run POST to fix.'
    });

  } catch (error) {
    console.error('Database check error:', error);
    // SEC-5: Sanitized error response
    return NextResponse.json({ 
      error: 'Failed to check database'
    }, { status: 500 });
  }
}
