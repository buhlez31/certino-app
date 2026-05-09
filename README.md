# Certino App

Next.js 15 app with App Router. Frontend (React) + backend (route handlers under `app/api`) live in the same project, share one `package.json`.

## Stack

- Next.js (App Router) on Node.js
- TypeScript
- Tailwind CSS
- recharts, lucide-react

## Layout

```
app/
  api/            # backend route handlers (route.ts)
    health/
  layout.tsx
  page.tsx        # renders <CertinoDemo />
  globals.css
components/       # shared UI (e.g., certino-demo.jsx)
lib/              # server/client utils, db, helpers
types/            # shared TS types
public/           # static assets
.env.example      # template; copy to .env.local
```

## Dev

```bash
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

API health check: `GET http://localhost:3000/api/health`

## Notes

- Node >= 20.9 required by Next.js. Current local env is v18 — upgrade before running.
- `components/certino-demo.jsx` is the original demo file with `"use client"` added at top.
