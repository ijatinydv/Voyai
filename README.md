# Voyai - AI Travel Planner

## Project Overview

Voyai is a full-stack travel planner that turns a few trip details into a usable itinerary. A user signs up, creates a trip, chooses a destination, trip length, budget tier, and interests, then Voyai generates a day-by-day plan with activity costs, a budget breakdown, hotel suggestions, and a packing checklist.

The project is not just a prompt box around an LLM. The app saves trips per user, lets travelers edit activities after generation, regenerate a single day with custom instructions, refresh hotels or budget estimates, and use a practical packing list while preparing for the trip.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | Next.js 14, TypeScript |
| Styling | Tailwind CSS |
| Client state | Zustand |
| Forms and validation | React Hook Form, Zod |
| API client | Axios with auth retry/interceptor flow |
| Backend | Node.js , Express , TypeScript |
| Database | MongoDB |
| Auth | JWT access tokens, refresh-token cookie, bcrypt password hashing |
| AI provider | OpenAI SDK pointed at Novita's OpenAI-compatible API |
| Places autocomplete | Geoapify browser API |

I kept the frontend and backend as separate apps because it makes the API boundary clear and keeps the AI/database work off the browser. Next.js handles the user experience and route protection, while Express owns authentication, persistence, rate limiting, validation, and AI orchestration. The OpenAI SDK is used with a configurable `NOVITA_BASE_URL`, so the model provider can be swapped without rewriting the travel services.

## Setup Instructions

### Prerequisites

- Node.js 20.x
- npm
- MongoDB connection string, either local MongoDB or MongoDB Atlas
- Novita API key
- Optional: Geoapify API key for destination autocomplete

### Local Backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Fill `backend/.env` with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/voyai
JWT_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret
NOVITA_API_KEY=your_novita_key
NOVITA_BASE_URL=https://api.novita.ai/openai
LLM_MODEL=deepseek/deepseek-v4-flash
CORS_ORIGIN=http://localhost:3000
```

The backend runs at `http://localhost:5000`, with API routes under `http://localhost:5000/api`. A quick health check is available at `http://localhost:5000/health`.

### Local Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Fill `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key_if_you_want_autocomplete
```

The frontend runs at `http://localhost:3000`.

## High-Level Architecture

```text
User browser
  |
  | Next.js pages, forms, Zustand stores
  v
Frontend services and Axios client
  |
  | Bearer access token + refresh cookie support
  v
Express API
  |
  |-- Auth routes: register, login, refresh, logout, me
  |-- Trip routes: CRUD, activity edits, pagination
  |-- AI routes: generate trip, regenerate day, hotels, packing list
  |
  | MongoDB via Mongoose
  v
Users and Trips collections

Express AI services
  |
  |-- Itinerary service
  |-- Budget service
  |-- Hotel service
  |-- Packing service
  v
Novita/OpenAI-compatible model API
```

The frontend is organized around route groups: public landing/auth routes and protected dashboard routes. Trip creation is a guided form. Once a trip exists, the backend stores an initial empty itinerary and then the AI generation endpoint fills in itinerary, budget, and hotel data.

The backend is layered as routes -> controllers -> services -> models. Controllers stay thin, services handle validation and data rules, and Mongoose models define the stored user/trip shape.

## Authentication and Authorization

Voyai uses email/password authentication.

- Passwords are hashed with bcrypt before saving.
- Login/register returns a short-lived JWT access token.
- A refresh token is stored in an HTTP-only cookie for 7 days.
- Protected backend routes require `Authorization: Bearer <accessToken>`.
- The frontend Axios client automatically attaches the access token.
- On a 401 response, the client calls `/api/auth/refresh`, stores the new access token, and retries the original request once.
- Trips are always queried by both `_id` and `userId`, so one user cannot read, edit, or delete another user's trips by guessing an ID.

The frontend also writes the access token to a lightweight cookie so Next.js middleware can redirect unauthenticated users away from `/dashboard`, `/trips`, and `/profile`. That cookie is used for route gating, while the backend still enforces real authorization.

## AI Agent Design and Purpose

The AI part is split into small travel agents instead of one giant prompt:

- Itinerary agent: creates realistic day-by-day activities for the selected destination, trip length, interests, and budget tier.
- Budget agent: estimates flights/main transport, local transport, accommodation, food, activities, miscellaneous, and total cost.
- Hotel agent: suggests 3-5 accommodation options that match the destination and budget.
- Day regeneration agent: rewrites only one selected day using the user's instruction, while considering the rest of the itinerary.
- Packing generator: creates a deterministic checklist from the destination, season, interests, and itinerary activities.

The LLM services ask for compact JSON only, validate the response with Zod, and run a repair prompt if the model returns malformed JSON. This keeps model output usable by the UI instead of dumping raw prose into the database.

## Creative / Custom Feature

The custom feature I would call out is the smart packing list.

After the trip is generated, Voyai can build a packing checklist from the destination, trip length, interests, season, and itinerary activities. It is not just a generic "bring clothes and charger" list. For example, beach trips can surface swimwear and waterproof pouches, hiking trips can add trail socks and a daypack, and culture-heavy trips can suggest modest outfits for religious or heritage sites.

The packing list is grouped into clothing, documents, electronics, toiletries, health and safety, and destination-specific gear. Users can check items off, see packing progress, reset the list, and copy the checklist to the clipboard when they want to keep it outside the app.

## Key Design Decisions and Trade-Offs

- Separate frontend and backend: clearer security and API boundaries, but it means two deployments and CORS/cookie setup.
- JWT access token plus refresh cookie: good UX without logging users out constantly, but token storage and cookie domain rules need care.
- Zod validation on both sides: more boilerplate, but fewer bad API requests and safer LLM parsing.
- AI output stored in MongoDB: fast trip detail pages and editable results, but generated data can become stale if prices or availability change.
- OpenAI-compatible SDK with Novita: easy model/provider configuration, but the app still depends on external model latency and quota.
- Packing list is deterministic: faster and more stable than another LLM call, but less creatively personalized than a fully model-generated list.
- Regenerating the budget currently calls the full trip generation endpoint: simple reuse, but it can refresh more than just the budget.

## Known Limitations

- Hotel suggestions and budgets are estimates, not live booking or pricing data.
- The app does not currently integrate maps, live transport schedules, weather, or booking APIs.
- Refresh tokens are not stored server-side for revocation tracking; logout clears the cookie, but already-issued tokens remain valid until expiry.
- Production cookie behavior may need adjustment if frontend and backend are deployed on completely different domains.
- The frontend route middleware checks for an access-token cookie, but backend authorization is still the real source of truth.
- There is no admin role or team sharing yet; trips are private to the user who created them.
- Generated itineraries are only as reliable as the model response and should be reviewed before real travel decisions.

