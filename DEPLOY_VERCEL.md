# Vercel Deployment Guide

## Prerequisites

1. Vercel account: https://vercel.com/signup
2. Vercel CLI: `npm i -g vercel`
3. Database (een van de volgende):
   - Railway: https://railway.app
   - Supabase: https://supabase.com
   - Neon: https://neon.tech

## Step 1: Setup Database

### Option A: Railway (Recommended)
1. Ga naar https://railway.app
2. Klik "New Project" → "Provision PostgreSQL"
3. Kopieer de "Database URL" naar je .env file

### Option B: Supabase
1. Ga naar https://supabase.com
2. Maak een nieuw project
3. Ga naar Settings → Database → Connection string

## Step 2: Environment Variables

Kopieer deze waarden voor Vercel:

```
NEXTAUTH_URL=https://jouw-project-naam.vercel.app
NEXTAUTH_SECRET= (genereer met: openssl rand -base64 32)
DATABASE_URL= (van je database provider)
ENCRYPTION_KEY= (genereer met: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

Optioneel:
```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Step 3: Deploy

### Method A: Vercel CLI (makkelijkst)

```bash
# Login bij Vercel
vercel login

# Deploy (vanuit de project folder)
cd Spaarslimmer-26e38664198557a573b2dd27cb7753873a875074
vercel --prod

# Environment variables toevoegen via CLI
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add ENCRYPTION_KEY
# etc...
```

### Method B: Git Integration (GitHub)

1. Push je code naar GitHub
2. Ga naar https://vercel.com/new
3. Selecteer je repository
4. Vul de environment variables in
5. Klik "Deploy"

## Step 4: Database Migrations

Na eerste deploy, run migrations:

```bash
# Via Vercel CLI
vercel --prod

# Daarna lokaal met je DATABASE_URL:
npx prisma migrate deploy
```

Of gebruik de API endpoint (eenmalig):
```
GET https://jouw-project.vercel.app/api/migrate
```

## Step 5: Create First User

Na deploy, maak een test user:

```bash
# Lokaal met productie database
DATABASE_URL="jouw-prod-db-url" node create-test-user.js
```

Of gebruik de seed API:
```
GET https://jouw-project.vercel.app/api/seed
```

## Troubleshooting

### Build Errors
- Check of alle env vars zijn ingesteld
- Run lokaal: `npm run build`

### Database Errors
- Check DATABASE_URL format: `postgresql://user:pass@host:port/db`
- Zorg dat database toegankelijk is vanaf internet

### Prisma Errors
- Zorg dat `prisma generate` in build command zit (al ingesteld in vercel.json)
- Check of `@prisma/client` in dependencies staat

## Support

Bij problemen, check:
1. Vercel logs: https://vercel.com/dashboard → project → deployments → logs
2. Build output lokaal: `npm run build`
