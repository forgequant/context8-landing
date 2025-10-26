# Quickstart: Context8 Landing Page Development

**Feature**: 002-frontend-rewrite-vite-react19
**Date**: 2025-10-26
**Purpose**: Get developers up and running with the Context8 landing page project

## Prerequisites

Before starting development, ensure you have:

- **Node.js**: v20.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE (with extensions below)

### Recommended VS Code Extensions

```bash
# Install these for best developer experience
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension unifiedjs.vscode-mdx
```

---

## Initial Setup

### 1. Navigate to Project Directory

```bash
cd /Users/vi/context/projects/forgequant/context8-landing
```

### 2. Create Frontend-v2 Directory

```bash
mkdir -p frontend-v2
cd frontend-v2
```

### 3. Initialize Vite Project

```bash
# Create Vite project with React + TypeScript template
npm create vite@latest . -- --template react-ts

# Answer prompts:
# - Project name: frontend-v2 (already in directory, press Enter)
# - Select framework: React
# - Select variant: TypeScript
```

### 4. Install Dependencies

```bash
# Core dependencies
npm install

# Add Tailwind CSS v4
npm install -D tailwindcss@next postcss autoprefixer
npx tailwindcss init -p

# Add Framer Motion
npm install framer-motion

# Add utility libraries
npm install clsx tailwind-merge

# Add development tools
npm install -D @types/node
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D playwright @playwright/test
```

---

## Configuration Files

### 1. Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'animation-vendor': ['framer-motion']
        }
      }
    }
  }
})
```

### 2. Tailwind Configuration (tailwind.config.ts)

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0B0C0E',
          900: '#121317',
          800: '#1A1C21'
        },
        terminal: {
          text: '#E6E8EC',
          muted: '#B1B5C1',
          cyan: '#7DD3FC',
          green: '#4ADE80',
          red: '#F87171'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
} satisfies Config
```

### 3. TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Vitest Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### 5. Playwright Configuration (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
```

---

## Project Structure Setup

### Create Directory Structure

```bash
# From frontend-v2 directory
mkdir -p src/{components/{terminal,code,sections,ui,layout},hooks,data,styles,lib}
mkdir -p public/{fonts,images}
mkdir -p tests/{unit,e2e}
```

### Initial Files

Create `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-graphite-950 text-terminal-text font-sans antialiased;
  }

  pre, code {
    @apply font-mono;
  }
}
```

Create `src/lib/cn.ts` (className utility):
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Update `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Update `src/App.tsx`:
```typescript
function App() {
  return (
    <div className="min-h-screen bg-graphite-950">
      <h1 className="text-4xl font-mono text-terminal-cyan p-8">
        Context8 Landing Page
      </h1>
    </div>
  )
}

export default App
```

---

## Development Workflow

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Run Tests

```bash
# Unit tests (Vitest)
npm run test

# Unit tests (watch mode)
npm run test:watch

# E2E tests (Playwright)
npm run test:e2e

# E2E tests (UI mode for debugging)
npm run test:e2e:ui
```

### Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

### Code Quality Checks

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

---

## Package.json Scripts

Update `package.json` to include these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\""
  }
}
```

---

## Development Best Practices

### Component Development Pattern

1. **Create component file** in appropriate directory
2. **Define TypeScript interface** for props
3. **Implement component** with hooks as needed
4. **Add unit test** in `/tests/unit/`
5. **Use in parent component**

Example:
```typescript
// src/components/ui/Button.tsx
import { cn } from '@/lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded font-medium transition-colors',
        variant === 'primary' && 'bg-terminal-cyan text-graphite-950 hover:bg-terminal-cyan/90',
        variant === 'secondary' && 'border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
```

### Custom Hook Pattern

```typescript
// src/hooks/useTypewriter.ts
import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [displayText, text, speed])

  return { displayText, isComplete }
}
```

---

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@/...'"
- **Solution**: Ensure `tsconfig.json` has `paths` configured correctly and restart VS Code

**Issue**: Tailwind classes not applying
- **Solution**: Check `tailwind.config.ts` `content` array includes all component files

**Issue**: Animations not working
- **Solution**: Verify Framer Motion is installed and imported correctly

**Issue**: Tests failing with "Cannot find module"
- **Solution**: Check `vitest.config.ts` has matching path aliases

---

## Next Steps

1. Review the [spec.md](./spec.md) for feature requirements
2. Review [data-model.md](./data-model.md) for TypeScript interfaces
3. Review [contracts/components.md](./contracts/components.md) for component APIs
4. Review [contracts/animations.md](./contracts/animations.md) for animation patterns
5. Begin implementation following [tasks.md](./tasks.md) (once generated)

---

## Resources

- **Vite Docs**: https://vitejs.dev
- **React 19 Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Vitest**: https://vitest.dev
- **Playwright**: https://playwright.dev

For questions or issues, refer to the spec and planning documents in `/specs/002-frontend-rewrite-vite-react19/`.
