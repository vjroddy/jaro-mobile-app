# JARO Fullstack - Quickstart

This branch (fullstack/jaro) contains a work-in-progress full-stack implementation for the JARO platform. It includes a backend scaffold (Express + TypeScript + Prisma), an admin scaffold, and docker-compose for local development.

Important: this is the initial commit and several pieces (mobile app integration, Cloudinary, real mobile-money provider integration, and CI) will be added incrementally.

Quick steps (development):
1. Start docker compose (Postgres + backend dev):
   docker-compose up --build

2. From another shell, generate Prisma client and run migrations (first time):
   cd backend
   npm install
   npx prisma generate
   # create migration (optional) and apply
   npx prisma migrate dev --name init

3. Start the backend dev server (inside the backend folder):
   npm run dev

Notes:
- Mobile-money integration is stubbed to use a webhook flow. We'll integrate a provider (Flutterwave recommended) and wire the phone number +256709665041 into payment initiation where supported.
- Do NOT commit real API keys. Use the .env.example values as templates and set secrets in your hosting/CI provider.
