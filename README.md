# Localia

Real estate platform for Mercedes, Buenos Aires. Built with SvelteKit, TypeScript, Tailwind CSS, and Playwright.

## Prerequisites

- **Node.js** 20.15.0 or higher
- **npm** 10.x or higher

Check your versions:

```sh
node --version
npm --version
```

## Installation

```sh
npm install
```

## Development

```sh
npm run dev
```

Opens at [http://localhost:5173/localia/](http://localhost:5173/localia/)

## Available Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start development server            |
| `npm run build`         | Build for production                |
| `npm run preview`       | Preview production build locally    |
| `npm run check`         | Type-check with svelte-check        |
| `npm run check:watch`   | Type-check in watch mode            |
| `npm run test`          | Run Playwright tests                |
| `npm run test:ui`       | Run Playwright tests with UI        |
| `npm run test:headed`   | Run Playwright tests in headed mode |
| `npm run test:coverage` | Run tests with coverage report      |
| `npm run lint`          | Run ESLint                          |
| `npm run lint:fix`      | Fix ESLint auto-fixable issues      |
| `npm run format`        | Format all files with Prettier      |

## Tech Stack

- **Framework**: SvelteKit with TypeScript
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Testing**: Playwright
- **Linting**: ESLint + Prettier
- **Adapter**: @sveltejs/adapter-static

## Project Structure

```
localia/
├── src/
│   ├── lib/
│   │   ├── api/           # API client (axios-based)
│   │   ├── components/    # Reusable UI components
│   │   ├── data/          # Type definitions and mock data
│   │   └── stores/        # Svelte stores (auth, filters, favorites)
│   └── routes/           # SvelteKit pages
├── tests/                # Playwright E2E tests
├── docs/                 # System documentation (SISTEMA.md)
├── eslint.config.js      # ESLint flat config
├── prettier.config.js   # Prettier config (tabs, 4 spaces)
├── playwright.config.ts # Playwright config
└── svelte.config.js    # SvelteKit config
```

## API Integration

The frontend integrates with the Localia Core API (NestJS backend). All API calls use axios with `withCredentials: true` for session handling.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:3000) |

## Architecture Notes

- **Connected to Backend**: API-first architecture with real backend
- **Location**: All properties are located in Mercedes, Buenos Aires, Argentina
- **URL base**: `/localia` (configured in svelte.config.js)
- **Favorites & filters**: Synced with URL query params
- **Session**: Handled via cookies with Better Auth

## Code Quality

ESLint and Prettier are configured with Svelte and TypeScript support.

```sh
npm run lint
npm run format
```

ESLint runs as part of the CI pipeline on every push.

## Documentation

For domain knowledge, user flows, and feature details, see:

- [`docs/SISTEMA.md`](docs/SISTEMA.md) — Complete system guide in Spanish

## Routes

| Route                  | Description                  | Access |
| ---------------------- | ---------------------------- | ------ |
| `/`                    | Homepage with search/filters | Public |
| `/property/[id]`       | Property detail page         | Public |
| `/masterplan`          | List of developments         | Public |
| `/masterplan/[id]`     | Interactive development map  | Public |
| `/tablero`             | Public search board          | Public |
| `/furnisher`           | Virtual staging tool         | Agents |
| `/publicar`            | Publish property form        | Agents |
| `/mis-propiedades`     | Agent's property list        | Agents |
| `/perfil`              | Agent profile & agency       | Agents |
| `/chepibe`             | WhatsApp CRM mock            | Agents |
| `/inmobiliaria/[slug]` | Agency landing page          | Public |
