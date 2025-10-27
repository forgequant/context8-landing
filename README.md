# Context8 Landing Page

A modern, terminal-aesthetic landing page built with React 19, Vite 6, Tailwind CSS v4, and Framer Motion 12.

## Features

- **Dark Theme**: Terminal-inspired UI with custom color palette
- **Smooth Animations**: 60fps scroll-triggered effects with Framer Motion
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Performance Optimized**: Bundle size <200KB, Lighthouse score 90+
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Type-Safe**: Full TypeScript strict mode with path aliases
- **Tested**: Unit tests (Vitest) and E2E tests (Playwright)

## Tech Stack

- **React 19** - Concurrent rendering and latest features
- **Vite 6** - Lightning-fast dev server and optimized builds
- **Tailwind CSS v4** - Utility-first CSS with custom dark theme
- **Framer Motion 12** - Production-ready animation library
- **TypeScript 5.3+** - Strict mode for type safety
- **Vitest** - Fast unit testing with jsdom
- **Playwright** - Cross-browser E2E testing

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run type checking
npm run typecheck

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

```bash
# Run tests in watch mode
npm run test:watch

# Run E2E tests with UI
npm run test:e2e:ui

# Format code
npm run format

# Lint code
npm run lint
```

## Project Structure

```
frontend-v2/
├── src/
│   ├── components/
│   │   ├── terminal/     # Terminal-themed components
│   │   ├── code/         # Code display components
│   │   ├── sections/     # Page section components
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   ├── hooks/            # Custom React hooks
│   ├── data/             # Static content and configuration
│   ├── styles/           # Global styles and fonts
│   ├── lib/              # Utilities and helpers
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/
│   ├── fonts/            # Self-hosted fonts
│   └── images/           # Static images
├── tests/
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright E2E tests
└── vite.config.ts        # Vite configuration
```

## Performance Targets

- **Bundle Size**: <200KB (gzip)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Animation**: 60fps on modern devices
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT
