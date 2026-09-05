# Task Manager

A full-stack task management application built with Cloudflare Workers, D1, Next.js, and Drizzle ORM.

## Live URLs
- Frontend: https://83ab1ced.task-manager-frontend-an3.pages.dev
- Backend API: https://task-manager-api.rahul-task-manager.workers.dev

## Tech Stack
- **Backend**: Cloudflare Workers, Hono, Drizzle ORM, Cloudflare D1
- **Frontend**: Next.js 16 (App Router), Tailwind CSS
- **Auth**: Jose (JWT), bcryptjs
- **Validation**: Zod
- **Language**: TypeScript (strict mode)

## Local Setup

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI

### Backend Setup
```bash
cd backend
npm install
npx wrangler d1 create task-manager-db
npx wrangler d1 migrations apply task-manager-db --local
npx wrangler secret put JWT_SECRET
npx wrangler dev
