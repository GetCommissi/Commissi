const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.test file if it exists (only in development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
}

const prisma = new PrismaClient();

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@test.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'testsmart2026!';
const TEST_USER_NAME = process.env.TEST_USER_NAME || 'Test Consultant';
const TEST_USER_ROLE = process.env.TEST_USER_ROLE || 'CONSULTANT';

async function main() {
  const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);
  
  const user = await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {},
    create: {
      email: TEST_USER_EMAIL,
      password: hashedPassword,
      name: TEST_USER_NAME,
      role: TEST_USER_ROLE,
      status: 'ACTIVE',
    },
  });
  
  console.log('Test user created:', user.email);
  console.log('Password:', TEST_USER_PASSWORD);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
