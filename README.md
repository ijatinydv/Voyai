# Voyai - AI Travel Planner

Plan smarter trips with AI-powered itineraries, budget estimates, hotel suggestions, and packing lists.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript, MongoDB with Mongoose |
| AI | Anthropic SDK and Google GenAI SDK |
| Auth | JWT access tokens and refresh-token cookies |
| Package Manager | npm, with separate installs per app |

## Getting Started

Install and run each app from its own folder:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The backend expects MongoDB to be available from `backend/.env`, and the default development API URL is `http://localhost:5000/api`.

## Project Structure

```text
ai-travel-planner/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── .env.local
├── backend/
│   ├── src/
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── .env
├── .gitignore
└── README.md
```
