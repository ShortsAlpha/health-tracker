# Personal Health OS

A personal dashboard that keeps nutrition, weight and body composition, workouts and runs in one place, with AI help for logging food and reading blood-test reports.

## Features

- **Dashboard:** today's meals with calories and macros, calorie intake chart, weight and body-composition history, recent workouts and a logging streak, with weekly, monthly and 3-month views.
- **Daily and bulk entry:** log meals, weight, body fat, muscle and water percentages, and workouts, one day at a time or in bulk.
- **Food search:** search a built-in database of 1,000 Turkish foods with calories and macros per serving. For anything not in the list, Google Gemini estimates the nutrition from a short description.
- **Blood tests:** upload a lab report PDF. The text is extracted with `pdf-parse`, then Gemini pulls out each marker with its value, unit and reference range, plus the hospital and test date.
- **Calendar:** see what was logged on each day.
- **Run sync:** `POST /api/runs/sync` receives runs from my iOS run-tracking app (duration, distance, calories, average heart rate, steps and GPS route), protected by an API key header.

## Tech stack

- **App:** Next.js 15 (App Router, server actions), React 19, TypeScript
- **UI:** Tailwind CSS 4, shadcn/ui (Radix), Recharts, react-hook-form + zod
- **Data:** Supabase (Postgres)
- **AI:** Google Gemini, pdf-parse

## Run locally

1. Create a Supabase project with these tables: `meals`, `metrics`, `workouts`, `runs`, `food_items`, `nutrition`, `blood_tests`, `blood_markers`.
2. Create `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   GEMINI_API_KEY=
   RUNAI_SYNC_SECRET=
   ```

   `RUNAI_SYNC_SECRET` is the value the iOS app sends in the `x-api-key` header.

3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000.

4. Optional: load the food database with `npx tsx scripts/seed-food.ts`.

## Project structure

```
actions/      server actions for meals, metrics, workouts, runs, food search and nutrition estimates
app/          pages (dashboard, entry, calendar, runs, updates) and API routes (upload, runs/sync)
components/   dashboard cards, charts, forms and shadcn/ui components
lib/          Gemini client, PDF loader, helpers
scripts/      data import and seed scripts
```
