# Random Quote Generator

A clean, production-ready single-page Random Quote Generator built with React and Tailwind CSS. Features curated quotes, four customizable themes, and a sharp, functional UI.

## Features

- **15 curated quotes** from notable figures
- **Random quote selection** with no consecutive duplicates
- **4 themes**: Minimal, Dark, Warm, Mono
- **Keyboard support**: Press `Space` for new quote
- **Accessible**: ARIA labels, semantic HTML, focus management
- **CI/CD**: Automatic deployment to Cloudflare Pages via GitHub Actions

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 3
- Cloudflare Pages

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

The app is configured for automatic deployment to Cloudflare Pages via GitHub Actions (`.github/workflows/deploy.yml`).

### Setup

1. Create a Cloudflare account and get your [Account ID](https://dash.cloudflare.com/?to=/:account/workers/overview)
2. Create an [API Token](https://dash.cloudflare.com/profile/api-tokens) with `Cloudflare Pages: Edit` permission
3. Add these secrets to your GitHub repo (`Settings → Secrets and variables → Actions`):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Create a Cloudflare Pages project named `quote-generator` connected to this repo
5. Push to `master` branch to trigger deployment

### Manual Deployment

```bash
npm run build
npx wrangler pages deploy dist --project-name=quote-generator
```

## Design

Anti-"vibe-coded" aesthetic: no glassmorphism, neon gradients, or generic purple hero cards. Clean grid layouts, crisp typography, functional borders, subtle hover transitions, utility-driven spacing.
