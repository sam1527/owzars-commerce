# Owzars Commerce

A Next.js 14 App Router starter configured with Tailwind CSS, TypeScript, ESLint, MongoDB/Mongoose, Stripe, NextAuth, and bcrypt.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

## Environment Variables

See `.env.example` for the required values. At minimum you will need:

- `MONGODB_URI` for your MongoDB connection string
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for NextAuth
- `GITHUB_ID`/`GITHUB_SECRET` for OAuth (or replace with another provider)
- `STRIPE_SECRET_KEY` for Stripe server-side usage

## Project Structure

- `app/` – App Router routes and pages
- `app/api/auth/[...nextauth]/route.ts` – NextAuth route handler
- `lib/mongodb.ts` – Mongoose connection helper
- `lib/stripe.ts` – Stripe SDK singleton
- `lib/auth.ts` – NextAuth configuration (GitHub + credentials)
- `models/User.ts` – Example Mongoose user model with bcrypt-ready password
- `tailwind.config.ts` / `app/globals.css` – Tailwind styling setup

## Linting

ESLint is configured with `next/core-web-vitals`. Run `npm run lint` to check the project.
