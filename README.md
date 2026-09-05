# Task Manager

A full-stack task management application built with Cloudflare Workers, D1, Next.js, and Drizzle ORM.

## Live URLs
- Frontend: https://6beebbdb.task-manager-frontend-an3.pages.dev
- Backend API: https://task-manager-api.rahul-task-manager.workers.dev

## Tech Stack
- **Backend**: Cloudflare Workers, Hono, Drizzle ORM, Cloudflare D1
- **Frontend**: Next.js (App Router), Tailwind CSS v4
- **Auth**: Jose (JWT), bcryptjs
- **Validation**: Zod
- **Language**: TypeScript (strict mode)

## Local Setup

### Prerequisites
- Node.js 18+
- Cloudflare account with Wrangler CLI (`npm i -g wrangler`)

### Backend Setup
```bash
cd backend
npm install
npx wrangler d1 create task-manager-db
npx wrangler d1 migrations apply task-manager-db --local
npx wrangler secret put JWT_SECRET
npx wrangler dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL in .env.local
npm run dev
```

## Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend Worker URL e.g. `https://task-manager-api.<account>.workers.dev` |

### Backend
| Secret | Description |
|---|---|
| `JWT_SECRET` | Signs/verifies JWTs — set with `npx wrangler secret put JWT_SECRET` |

## Database Migrations

```bash
# local
npx wrangler d1 migrations apply task-manager-db --local

# production
npx wrangler d1 migrations apply task-manager-db --remote
```

## Deployment

### Backend
```bash
cd backend && npx wrangler deploy
```

### Frontend
```bash
cd frontend
npm run build
npx wrangler pages deploy out --project-name task-manager-frontend
```
