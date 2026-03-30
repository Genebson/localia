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
- **Styling**: Tailwind CSS
- **Testing**: Playwright
- **Linting**: ESLint + Prettier
- **Adapter**: @sveltejs/adapter-static

## Project Structure

```
localia/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable UI components
│   │   ├── data/           # Mock data (properties, agencies, masterplans)
│   │   └── stores/         # Svelte stores (auth, filters, favorites)
│   └── routes/             # SvelteKit pages
├── tests/                  # Playwright E2E tests
├── docs/                   # System documentation (SISTEMA.md)
├── eslint.config.js        # ESLint flat config
├── prettier.config.js      # Prettier config (tabs, 4 spaces)
├── playwright.config.ts    # Playwright config
└── svelte.config.js       # SvelteKit config
```

## Architecture Notes

- **Frontend only**: No backend. All data is mocked in localStorage and Svelte stores.
- **Location**: All mock properties are located in Mercedes, Buenos Aires, Argentina.
- **URL base**: `/localia` (configured in svelte.config.js)
- **Favorites & properties**: Stored in browser localStorage
- **Filters**: Synchronized with URL query params

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
