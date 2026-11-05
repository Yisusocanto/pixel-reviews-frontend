# Pixel Reviews Frontend

[![CI](https://github.com/Yisusocanto/pixel-reviews-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Yisusocanto/pixel-reviews-frontend/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-149ECA.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)

Web client for **Pixel Reviews**, an open-source social platform for discovering video games, publishing community reviews, curating wishlists, and discussing titles with other players.

> **Version Notice (v2):** This repository is the second version of the Pixel Reviews web application, re-engineered from the ground up with Next.js App Router, Feature-Sliced architecture, strict TypeScript typing, and automated CI testing. The initial version of the project is now deprecated and remains available for reference at [Pixel Reviews v1 (Deprecated)](https://github.com/Yisusocanto/pixel_reviews).
>
> **Companion Repository:** The FastAPI backend service that powers this application is maintained at [pixel-reviews-api](https://github.com/Yisusocanto/pixel-reviews-api).

---

## Architecture & Engineering Highlights

- **Feature-Based Modular Architecture:** Domain logic, UI components, Server Actions, React Query hooks, and TypeScript interfaces are colocated by feature under `features/` (`games`, `reviews`, `comments`, `likes`, `wishlists`, `users`, `settings`, `genres`, `platforms`).
- **Hybrid Rendering & Server Actions:** Combines Next.js App Router Server Components for SEO-friendly game and profile pages with Server Actions and client-side infinite queries (`@tanstack/react-query`) for interactive feeds and mutations.
- **Session & Token Rotation (Auth.js v5):** Implements stateless JWT sessions supporting both email/password credentials and Google OAuth 2.0, with automatic background access-token refresh against the FastAPI backend before expiration.
- **Typed HTTP Client (`apiClient`):** Centralized wrapper around native `fetch` that automatically injects active server session bearer tokens, serializes query parameters and payloads, and transforms FastAPI error responses into structured `ApiError` instances.
- **End-to-End Form Validation:** Client and server-side validation powered by `React Hook Form` and `Zod`.

---

## Tech Stack

| Layer                     | Technology                                                        |
| :------------------------ | :---------------------------------------------------------------- |
| **Framework**             | Next.js 16 (App Router), React 19                                 |
| **Language**              | TypeScript 5                                                      |
| **Authentication**        | NextAuth.js v5 (Auth.js)                                          |
| **State & Data Fetching** | TanStack React Query v5, Next.js Server Actions                   |
| **Forms & Validation**    | React Hook Form, Zod v4                                           |
| **Styling & UI**          | Tailwind CSS v4, Radix UI, shadcn/ui, Framer Motion, Lucide Icons |
| **Testing & Quality**     | Vitest, ESLint, Prettier, TypeScript Compiler (`tsc`)             |
| **Package Manager & CI**  | `pnpm`, GitHub Actions                                            |

---

## Project Structure

```text
pixel-reviews-frontend/
├── .github/workflows/       # Automated CI pipeline (Typecheck, ESLint, Vitest, Build)
├── app/                     # Next.js App Router pages, layouts, and route handlers
│   ├── (reset-password)/    # Password recovery and token reset routes
│   ├── actions/             # Shared authentication server actions
│   ├── api/auth/            # Auth.js route handlers
│   ├── games/[slug]/        # Game detail, ratings, screenshots, and reviews page
│   ├── search/              # Debounced game search interface
│   ├── settings/            # User profile and security settings page
│   └── users/[username]/    # Public user profile, reviews, and wishlist page
├── components/              # Shared layout, navigation, auth modals, and UI primitives
├── features/                # Domain-specific modules (actions, hooks, components, types)
├── hooks/                   # Global reusable React hooks
├── lib/                     # Typed API client, Zod validation schemas, and utilities
├── tests/                   # Vitest unit test suites
├── types/                   # Shared TypeScript definitions and NextAuth module augmentations
├── auth.config.ts           # NextAuth providers, callbacks, and token rotation logic
└── proxy.ts                 # Route protection proxy
```

---

## Getting Started

### Prerequisites

- **Node.js 22+**
- **pnpm** (`npm install -g pnpm`)
- A running instance of [pixel-reviews-api](https://github.com/Yisusocanto/pixel-reviews-api) (defaults to `http://localhost:8000`).

### 1. Clone the repository

```bash
git clone https://github.com/Yisusocanto/pixel-reviews-frontend.git
cd pixel-reviews-frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example environment file and configure your local values:

```bash
cp .env.example .env
```

| Variable              | Description                                        | Default / Example                           |
| :-------------------- | :------------------------------------------------- | :------------------------------------------ |
| `AUTH_SECRET`         | Secret key used by Auth.js to encrypt session JWTs | Generate with `npx auth secret`             |
| `API_URL`             | Backend FastAPI base URL for server-side requests  | `http://localhost:8000`                     |
| `NEXT_PUBLIC_API_URL` | Backend FastAPI base URL for client-side requests  | `http://localhost:8000`                     |
| `AUTH_GOOGLE_ID`      | Google OAuth 2.0 Client ID                         | `your_client_id.apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET`  | Google OAuth 2.0 Client Secret                     | `your_google_client_secret`                 |

### 4. Start the development server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

---

## Running Tests & Code Quality

```bash
# Run unit tests once
pnpm test

# Run unit tests in watch mode during development
pnpm test:watch

# Run static TypeScript type checking
pnpm typecheck

# Run ESLint
pnpm lint

# Format code with Prettier
pnpm format

# Verify full production build
pnpm build
```

---

## Contributing

Contributions, bug reports, and feature requests are welcome. Please follow the project workflow when submitting changes:

1. **Fork and clone** the repository.
2. **Create a branch** from `main` using semantic naming:
   - `feat/<short-description>` for new features
   - `fix/<short-description>` for bug fixes
   - `perf/<short-description>` for performance improvements
   - `refactor/<short-description>` for internal refactoring
   - `test/<short-description>` for adding or updating tests
   - `style/<short-description>` for UI/formatting adjustments
   - `chore/<short-description>` or `docs/<short-description>` for maintenance and documentation
3. **Add or update tests** in `tests/` when introducing new utilities, schemas, or client logic.
4. **Verify all checks locally** before committing:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   ```
5. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(games): add platform filter to search results`).
6. **Open a Pull Request** against `main`. The GitHub Actions CI pipeline (`Typecheck, Lint, Test & Build`) must pass before merging.

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.
