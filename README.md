# Voyai ✈️ — AI Travel Planner

> Plan smarter trips with AI-powered itineraries, budget estimates, and hotel suggestions.

## Stack

| Layer | Technology |
|---|---|
| **Monorepo** | pnpm Workspaces + Turborepo |
| **Frontend** | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| **Backend** | Express.js · TypeScript · MongoDB (Mongoose) |
| **AI** | Anthropic Claude (via `@anthropic-ai/sdk`) |
| **Shared Types** | `@voyai/types` internal package |
| **Auth** | JWT (access + refresh token pattern) |
| **Code Quality** | ESLint · Prettier · TypeScript strict mode |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev

# Build all apps
pnpm build
```

## Project Structure

```
ai-travel-planner/
├── apps/
│   ├── frontend/          # Next.js 14 App Router
│   └── backend/           # Express API server
├── packages/
│   └── types/             # Shared TypeScript interfaces (@voyai/types)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```
