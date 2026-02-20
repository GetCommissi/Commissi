# Commissi

Commission management platform for modern sales teams. Track commissions, manage leads, and grow your business.

**Tagline:** *"Your commissions. Your team. Crystal clear."*

## 🚀 Quick Start

### 1. Database Setup (PostgreSQL)

```bash
# Start PostgreSQL (Docker)
docker run --name commissi-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14

# Create database
docker exec commissi-db createdb -U postgres commissi
```

### 2. Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your values:
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - DATABASE_URL (PostgreSQL connection string)
# - ENCRYPTION_KEY (generate with: openssl rand -hex 32)
```

### 3. Install & Run

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## 🔐 Security Notes

- **NEXTAUTH_SECRET** is required - no fallback in production
- **ENCRYPTION_KEY** must be exactly 64 hex characters
- **/api/seed** and **/api/migrate** are disabled in production
- All admin endpoints require ADMIN role

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Prisma + PostgreSQL
- NextAuth.js
- Tailwind CSS
- Framer Motion

## 📝 License

Private - Commissi
