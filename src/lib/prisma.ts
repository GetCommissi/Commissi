import { PrismaClient } from '@prisma/client';
import { encryption } from '@/lib/encryption';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Demo mode helper
export const isDemoMode = () => {
  return !process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

// Prisma middleware voor automatische decryptie
prisma.$use(async (params, next) => {
  const result = await next(params);
  
  // Decrypt leads na ophalen
  if (params.model === 'Lead' && result) {
    const decryptLead = (lead: Record<string, unknown> | null) => {
      if (!lead) return lead;
      
      // Single lead - decrypt phone if it looks encrypted (longer than 20 chars)
      const phone = lead.phone as string;
      if (phone && phone.length > 20) {
        try {
          return {
            ...lead,
            phone: encryption.decrypt(phone),
            email: lead.email ? encryption.decrypt(lead.email as string) : null,
            ean: lead.ean ? encryption.decrypt(lead.ean as string) : null,
          };
        } catch {
          // If decryption fails, return as-is (might be plaintext)
          return lead;
        }
      }
      return lead;
    };
    
    // Array of leads
    if (Array.isArray(result)) {
      return result.map(decryptLead);
    }
    
    // Single lead
    return decryptLead(result);
  }
  
  return result;
});
