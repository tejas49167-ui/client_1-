# Lakshmi Embroidery E-Commerce App

A Next.js e-commerce app for Lakshmi Embroidery with product browsing, account authentication, cart management, checkout, and order history.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development

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

Create or update the local database:

```bash
DATABASE_URL="file:./dev.db" npm run db:push
DATABASE_URL="file:./dev.db" npm run db:seed
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
DATABASE_URL="file:./dev.db"
SESSION_SECRET="replace-with-a-long-random-secret"
```
