# Bubble

Multiplayer board game inspired by tech culture.

## Development

### Requirements

- [Deno](https://deno.land/) v2.6+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/)

### Setup

```bash
deno install
cp .env.example .env
supabase start
# Update .env with keys from supabase start output
deno task dev
```

### Environment Variables

Copy `.env.example` to `.env`:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — from `supabase start`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — [create OAuth app](https://github.com/settings/developers) (callback: `http://127.0.0.1:54321/auth/v1/callback`)

### URLs

- App: http://localhost:2022
- Supabase Studio: http://localhost:54323
