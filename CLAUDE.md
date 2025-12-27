# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bubble is a multiplayer board game inspired by Monopoly, reimagined for Silicon Valley startup culture. Players compete to build startup empires, raise funding, and reach a billion-dollar valuation. The game is built entirely using AI tools (Claude for code, Nano Banana Pro for assets).

## Commands

```bash
# Install dependencies
deno install

# Start development server (port 2022)
deno task dev

# Build for production
deno task build

# Preview production build
deno task preview

# Lint code
deno task lint

# Format code
deno task fmt

# Check formatting
deno task fmt:check

# Type check packages
deno task check

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop
```

## Architecture

### Monorepo Structure (Deno Workspaces)

- **game/** - Main SPA using TanStack Start + React 19 + Framer Motion
- **packages/game-logic/** (`@bubble/logic`) - Pure TypeScript game rules shared between client and server
- **packages/ui/** (`@bubble/ui`) - Shared React components (shadcn/ui)
- **packages/assets/** (`@bubble/assets`) - AI-generated game assets (B&W illustrations)
- **packages/db-types/** (`@bubble/db`) - TypeScript types from Supabase schema
- **supabase/** - Database migrations and Edge Functions
- **tools/asset-generator/** - Scripts for generating assets via Nano Banana Pro API
- **tools/content-generator/** - Scripts for text generation via Claude

### Tech Stack

- **Runtime**: Deno 2.6+ (chosen for Supabase Edge Functions compatibility)
- **Rendering**: React 19 + Framer Motion (no game engine - board game doesn't need one)
- **UI Framework**: TanStack Start (SPA mode) + shadcn/ui + Tailwind CSS
- **State**: Zustand (game state) + TanStack Query (Supabase data)
- **Backend**: Supabase (PostgreSQL, Realtime, Edge Functions, Auth)
- **Routing**: TanStack Router (file-based in `game/src/routes/`)

### Client-First Architecture

The app is client-first: all game logic runs in the browser. Supabase Edge Functions only handle:

- Authoritative validation (prevent cheating)
- Multi-player state persistence
- Actions affecting multiple players

The client uses optimistic updates - UI responds immediately, server validates async.

### State Management

| State Type             | Solution       | Examples                      |
| ---------------------- | -------------- | ----------------------------- |
| Game state (real-time) | Zustand        | Players, board, turn, actions |
| Server data (async)    | TanStack Query | User profile, match history   |
| UI state (local)       | React useState | Modals, hover states          |

Zustand is needed because Supabase Realtime handlers run outside React tree.

### UI vs Game Separation

**shadcn/ui components** (app interface):

- Modals, buttons, inputs, cards
- Lobby, settings, chat
- Toasts/notifications

**Custom CSS/Tailwind** (game visuals):

- Isometric board (CSS transforms)
- Tiles, buildings, tokens
- Dice animations
- Card illustrations
- Visual effects

### Play Mode

Play mode is fullscreen immersive:

- Board occupies 100% viewport
- Minimal UI overlay (menu, stats bar, action button)
- shadcn modals appear over the game when needed

### Key Patterns

- Game logic in `@bubble/logic` is shared between client and Supabase Edge Functions
- Board is rendered with CSS Grid + transforms for isometric perspective
- Animations use Framer Motion (token movement, dice, cards)
- Routes auto-generate to `game/src/routeTree.gen.ts`
- Import aliases in `deno.json` and `vite.config.ts`:
  - `@bubble/logic`, `@bubble/ui`, `@bubble/assets`, `@bubble/db` for packages
  - `@/` for `game/src/`

### Game Constants (from @bubble/logic)

- Board: 40 tiles, goal valuation $1B
- Starting: $500k cash, 100% equity
- Minimum equity before elimination: 10%
- IPO requires $500M+ valuation

## UI Conventions

- Dark mode only (shadcn/ui with zinc palette)
- Component style: radix-lyra
- Icon library: Tabler Icons
- Base color: zinc
- Illustrations: B&W flat design from Nano Banana Pro
- Sector colors: Subtle tints, not saturated (works with zinc palette)

## Package Management

**Always use `deno add` to install packages.** Never edit `package.json` versions directly.

```bash
# Add a dependency
deno add npm:package-name

# Add a dev dependency
deno add -D npm:package-name

# Examples
deno add npm:sonner
deno add -D npm:vitest npm:@testing-library/react
```

This ensures proper version resolution and lockfile updates.
