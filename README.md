# Bubble

Multiplayer board game inspired by startup culture.

## Requirements

- [Deno](https://deno.land/) v2.6+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/)

## Setup

```bash
# Install dependencies
deno install

# Copy environment variables
cp .env.example .env.local

# Start database
supabase start

# Start dev server
deno task dev
```

## URLs

- App: http://localhost:2022
- Supabase Studio: http://localhost:54323
