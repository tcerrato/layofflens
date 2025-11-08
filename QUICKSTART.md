# Quick Start - Local Development

Follow these steps to run LayoffLens locally:

## Prerequisites Check

Make sure you have:
- ✅ Node.js 20+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Azure Functions Core Tools v4 installed
- ✅ (Optional) Azurite installed for local storage

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install:all
```

### 2. Verify Environment Files

**Web app** (`apps/web/.env.local`):
```
NEXT_PUBLIC_API_BASE=http://localhost:7071
```

**API** (`apps/api/.env`):
```
SERPER_API_KEY=your-key-here
ADMIN_TOKEN=change-me
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
```

### 3. Start Azurite (Terminal 1)

For local Azure Table Storage emulation:

```bash
azurite --silent --location ~/.azurite --debug ~/.azurite/debug.log
```

Keep this running in the background.

### 4. Build Azure Functions (Terminal 2)

```bash
cd apps/api
pnpm build
cd ../..
```

Or use watch mode for auto-rebuild:
```bash
cd apps/api
pnpm watch
```

### 5. Start Development Servers (Terminal 2 or 3)

From project root:

```bash
pnpm dev
```

This starts:
- **Next.js**: http://localhost:3000
- **Azure Functions**: http://localhost:7071

### 6. Populate Initial Data (Terminal 3 or 4)

```bash
curl -X POST "http://localhost:7071/api/FetchNow?token=change-me"
```

Replace `change-me` with your `ADMIN_TOKEN` from `apps/api/.env`.

### 7. Open in Browser

Visit: **http://localhost:3000**

## Development Workflow

### Making Changes

- **Web app changes**: Hot reloads automatically
- **API changes**: Rebuild with `pnpm build` in `apps/api` (or use `watch` mode)

### Testing API Endpoints

```bash
# Get today's items
curl "http://localhost:7071/api/ListItemsHttp?days=1"

# Get last 7 days
curl "http://localhost:7071/api/ListItemsHttp?days=7"

# Manual fetch
curl -X POST "http://localhost:7071/api/FetchNow?token=your-admin-token"
```

## Troubleshooting

**Functions won't start?**
- Check Azure Functions Core Tools: `func --version`
- Verify port 7071 is free
- Check `apps/api/local.settings.json` exists

**Table Storage errors?**
- Ensure Azurite is running on port 10002
- Check Azurite logs: `~/.azurite/debug.log`

**Serper API errors?**
- Verify `SERPER_API_KEY` in `apps/api/.env`
- Check your Serper account has credits

**Next.js can't connect to API?**
- Ensure API is running on port 7071
- Check `NEXT_PUBLIC_API_BASE` in `apps/web/.env.local`

## Ports Used

- **3000**: Next.js web app
- **7071**: Azure Functions API
- **10002**: Azurite Table service

