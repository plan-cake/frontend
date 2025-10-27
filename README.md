# Plancake Frontend

A modern, responsive web application for scheduling and meeting coordination built with Next.js 15, React 19, and Tailwind CSS.

## Overview

Plancake is a meeting scheduling tool that helps users coordinate availability across time zones. The application allows users to create events, share availability grids, and find optimal meeting times.

---

## Architecture

### Tech Stack

**Core Framework:**

- [Next.js 15.3.1](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety

**Styling:**

- [Tailwind CSS 4.1.4](https://tailwindcss.com/) - Utility-first CSS framework
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge) - Conditional class merging
- [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings

**UI Components:**

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
  - Dialog
  - Popover
  - Select
  - Icons
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vaul](https://vaul.emilkowal.ski/) - Drawer component
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support

**Date/Time Handling:**

- [date-fns-tz](https://date-fns.org/) - Timezone utilities
- [react-day-picker](https://react-day-picker.js.org/) - Date picker component

**Development Tools:**

- [ESLint 9](https://eslint.org/) - Code linting
- [Prettier 3.5.3](https://prettier.io/) - Code formatting
- [Turbopack](https://turbo.build/pack) - Fast bundler (dev mode)

### `.env` Setup

Create a file called `.env` in the root directory, copying the contents of `example.env`.

Replace all values in the file with the relevant information.

## Local Development Setup

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+ or compatible package manager
- **Git** for version control

### Installation Steps

1. **Clone the repository**

   ```bash
   https://github.com/plan-cake/frontend.git
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will install all dependencies listed in [package.json](package.json), including:
   - Next.js 15.3.1 with React 19
   - Tailwind CSS 4.1.4
   - Radix UI components
   - TypeScript and type definitions

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will start on `http://localhost:3000` using Turbopack for fast refresh.

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

```bash
# Development server with Turbopack (fast refresh)
npm run dev

# Production build
npm run build

# Start production server (requires build first)
npm run start

# Lint code with ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting without modifying files
npm run check-format
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run start
```

The production build:

- Optimizes and minifies JavaScript/CSS
- Generates static pages where possible
- Creates optimized images
- Outputs to `.next/` directory

---

**Made with** [Next.js](https://nextjs.org/) **•** [Tailwind CSS](https://tailwindcss.com/) **•** [Radix UI](https://www.radix-ui.com/)
