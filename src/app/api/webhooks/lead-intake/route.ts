import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encryption, gdprHash } from '@/lib/encryption';
import crypto from 'crypto';
import { z } from 'zod';

// Lead data validation schema
const leadSchema = z.object({
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional().nullable(),
  ean: z.string().optional().nullable(),
  companyName: z.string().min(1, 'Company name is required'),
  contactName: z.string().optional().nullable(),
  niche: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  currentProvider: z.string().optional().nullable(),
  currentSupplier: z.string().optional().nullable(),
  consentEmail: z.boolean().default(false),
  consentPhone: z.boolean().default(false),
  consentWhatsapp: z.boolean().default(false),
  ownerId: z.string().optional().nullable(),
  status: z.string().default('NEW'),
});

/**
 * Verify webhook secret from header against environment variable
 */
function verifyWebhookSecret(request: NextRequest): boolean {
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('WEBHOOK_SECRET environment variable is not set');
    return false;
  }

  const headerSecret = request.headers.get('x-webhook-secret');
  if (!headerSecret) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    const headerBuffer = Buffer.from(headerSecret);
    const secretBuffer = Buffer.from(webhookSecret);
    
    if (headerBuffer.length !== secretBuffer.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(headerBuffer, secretBuffer);
  } catch {
    return false;
  }
}

/**
 * POST handler for incoming lead webhook
 * Accepts lead data, verifies secret, saves to database with source: 'WEBHOOK'
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - invalid or missing webhook secret' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    // Validate lead data
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data;

    // Get default owner if not provided (first active user, or create unassigned)
    let ownerId = leadData.ownerId;
    if (!ownerId) {
      const defaultUser = await prisma.user.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' },
        select: { id: true }
      });
      
      if (defaultUser) {
        ownerId = defaultUser.id;
      } else {
        return NextResponse.json(
          { success: false, error: 'No active user found to assign lead to' },
          { status: 500 }
        );
      }
    }

    // Encrypt sensitive fields
    const encryptedPhone = encryption.encrypt(leadData.phone);
    const encryptedEmail = leadData.email ? encryption.encrypt(leadData.email) : null;
    const encryptedEan = leadData.ean ? encryption.encrypt(leadData.ean) : null;

    // Generate phone hash for deduplication
    const phoneHash = gdprHash(leadData.phone);

    // Create lead in database with source: 'WEBHOOK'
    const lead = await prisma.lead.create({
      data: {
        phone: encryptedPhone,
        email: encryptedEmail,
        ean: encryptedEan,
        phoneHash: phoneHash,
        companyName: leadData.companyName,
        contactName: leadData.contactName,
        niche: leadData.niche,
        address: leadData.address,
        city: leadData.city,
        province: leadData.province,
        postalCode: leadData.postalCode,
        currentProvider: leadData.currentProvider,
        currentSupplier: leadData.currentSupplier,
        consentEmail: leadData.consentEmail,
        consentPhone: leadData.consentPhone,
        consentWhatsapp: leadData.consentWhatsapp,
        ownerId: ownerId,
        status: leadData.status,
        source: 'WEBHOOK',
        lawfulBasis: 'LEGITIMATE_INTEREST',
        gdprAcceptanceDate: new Date(),
      },
    });

    // Return success response with lead ID
    return NextResponse.json({
      success: true,
      leadId: lead.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Webhook lead intake error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for webhook health check
 */
export async function GET(request: NextRequest) {
  // Verify webhook secret for health checks too
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Lead intake webhook is active',
    timestamp: new Date().toISOString(),
  });
}
