# LayoffLens

A daily AI-powered tracker that aggregates the latest news, videos, and insights about layoffs, unemployment, and the impact of AI and automation on the job market.

## Project Structure

- `apps/web` - Next.js 15 frontend (TypeScript + Tailwind)
- `apps/api` - Azure Functions backend (Node 20 + TypeScript)
- `infra/` - Infrastructure configuration

## Quick Start

For detailed local development setup, see [SETUP.md](./SETUP.md).

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Azure Functions Core Tools v4
- (Optional) Azurite for local Azure Storage emulation
- Serper API key from [serper.dev](https://serper.dev)

### Quick Setup

1. **Install dependencies:**
   ```bash
   pnpm install:all
   ```

2. **Configure environment:**
   - Create `apps/web/.env.local` with `NEXT_PUBLIC_API_BASE=http://localhost:7071`
   - Create `apps/api/.env` with your `SERPER_API_KEY` (or update `local.settings.json`)

3. **Build and start:**
   ```bash
   cd apps/api && pnpm build && cd ../..
   pnpm dev
   ```

4. **Populate data:**
   ```bash
   curl -X POST "http://localhost:7071/api/FetchNow?token=change-me"
   ```

5. **Open:** http://localhost:3000

See [SETUP.md](./SETUP.md) for complete setup instructions and troubleshooting.

## API Endpoints

- `GET /api/ListItemsHttp?days=1` - Get items for last N days
- `POST /api/FetchNow?token=ADMIN_TOKEN` - Manually trigger data fetch
- `FetchDailyTimer` - Automatic daily fetch (timer trigger)

## Deployment

Deploy to Azure Static Web Apps with the configuration in `infra/staticwebapp.config.json`.

