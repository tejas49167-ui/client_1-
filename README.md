# Lakshmi Embroidery E-Commerce App

A Next.js e-commerce app for Lakshmi Embroidery with product browsing, account authentication, cart management, checkout, and order history.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Project Structure

```text
.
├── app/              # App routes and pages
├── components/       # Shared React components
├── lib/              # Auth, cart, Prisma, validation, and utilities
├── prisma/           # Database schema and seed script
├── public/           # Static images and public assets
└── package.json      # Scripts and dependencies
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and set a PostgreSQL connection string:

```bash
cp .env.example .env.local
```

Create or update the database:

```bash
npm run db:migrate
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

For local development, `.env.local` should contain:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
SESSION_SECRET="replace-with-a-long-random-secret"
```

## Deploy To Vercel

1. Import the GitHub repository in Vercel.
2. Keep the framework preset as `Next.js`.
3. Add these environment variables in Vercel Project Settings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
SESSION_SECRET="replace-with-a-long-random-secret"
```

4. Run `npm run db:deploy` against the production database once before using the app.
