# Local Development Setup Guide

This guide will help you set up LayoffLens for local development and testing.

## Prerequisites

### 1. Node.js and pnpm
- **Node.js**: Version 20 or higher (required for Azure Functions)
- **pnpm**: Package manager for the monorepo
  ```bash
  npm install -g pnpm
  ```

### 2. Azure Functions Core Tools
Required to run Azure Functions locally.

**macOS (using Homebrew):**
```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

**Windows (using npm):**
```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

**Linux:**
```bash
# Download and install from: https://github.com/Azure/azure-functions-core-tools
```

Verify installation:
```bash
func --version
```

### 3. Azurite (Azure Storage Emulator) - Optional but Recommended
For local Azure Table Storage emulation.

**macOS (using Homebrew):**
```bash
brew install azurite
```

**npm (all platforms):**
```bash
npm install -g azurite
```

### 4. Serper API Key
Get your API key from [Serper.dev](https://serper.dev):
1. Sign up at https://serper.dev
2. Get your API key from the dashboard
3. You'll need this for the `SERPER_API_KEY` environment variable

## Setup Steps

### Step 1: Install Dependencies

```bash
# From the project root
pnpm install:all
```

This will install dependencies for:
- Root workspace
- Next.js web app (`apps/web`)
- Azure Functions API (`apps/api`)

### Step 2: Configure Environment Variables

#### Web App Configuration

Create `apps/web/.env.local`:
```bash
NEXT_PUBLIC_API_BASE=http://localhost:7071
```

#### API Configuration

You have two options for configuring the API:

**Option 1: Use `.env` file (Recommended for local development)**

Create `apps/api/.env`:
```bash
SERPER_API_KEY=your-actual-serper-api-key-here
ADMIN_TOKEN=change-me-to-something-secure
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
```

**Option 2: Use `local.settings.json` (Azure Functions default)**

Update `apps/api/local.settings.json`:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AZURE_STORAGE_CONNECTION_STRING": "UseDevelopmentStorage=true",
    "SERPER_API_KEY": "your-actual-serper-api-key-here",
    "ADMIN_TOKEN": "change-me-to-something-secure"
  }
}
```

**Note:** The `.env` file is automatically loaded if it exists. If both exist, `local.settings.json` takes precedence (Azure Functions default behavior). For local development, using `.env` is simpler and more standard.

**Important:** Replace `your-actual-serper-api-key-here` with your real Serper API key from [serper.dev](https://serper.dev).

### Step 3: Start Azurite (Optional but Recommended)

In a separate terminal, start Azurite to emulate Azure Table Storage:

```bash
azurite --silent --location ~/.azurite --debug ~/.azurite/debug.log
```

This will start Azurite on:
- Blob service: `http://127.0.0.1:10000`
- Queue service: `http://127.0.0.1:10001`
- Table service: `http://127.0.0.1:10002` (used by the app)

Keep this terminal running while developing.

### Step 4: Build Azure Functions

The Functions need to be compiled from TypeScript:

```bash
cd apps/api
pnpm build
cd ../..
```

Or use watch mode for auto-recompilation:
```bash
cd apps/api
pnpm watch
```

### Step 5: Start Development Servers

From the project root, start both the web app and API:

```bash
pnpm dev
```

This will start:
- **Next.js web app**: http://localhost:3000
- **Azure Functions API**: http://localhost:7071

### Step 6: Populate Initial Data

In a new terminal, trigger a manual data fetch:

```bash
curl -X POST "http://localhost:7071/api/FetchNow?token=change-me"
```

Replace `change-me` with the `ADMIN_TOKEN` value from `apps/api/local.settings.json`.

You should see a response like:
```json
{
  "success": true,
  "message": "Fetched and saved 20 items",
  "count": 20
}
```

### Step 7: View the Application

Open your browser to:
- **Home page**: http://localhost:3000 (shows today's feed)
- **Archive page**: http://localhost:3000/archive (shows last 7 days)

## Development Workflow

### Running Individual Services

**Web app only:**
```bash
cd apps/web
pnpm dev
```

**API only:**
```bash
cd apps/api
pnpm build  # or pnpm watch
pnpm dev    # runs func start
```

### Testing API Endpoints

**List items (today):**
```bash
curl "http://localhost:7071/api/ListItemsHttp?days=1"
```

**List items (last 7 days):**
```bash
curl "http://localhost:7071/api/ListItemsHttp?days=7"
```

**Manual fetch:**
```bash
curl -X POST "http://localhost:7071/api/FetchNow?token=your-admin-token"
```

## Troubleshooting

### Azure Functions won't start
- Ensure Azure Functions Core Tools is installed: `func --version`
- Check that port 7071 is not in use
- Verify `apps/api/local.settings.json` exists and is valid JSON

### Table Storage errors
- Ensure Azurite is running on port 10002
- Check Azurite logs: `~/.azurite/debug.log`
- Verify `AZURE_STORAGE_CONNECTION_STRING` is set to `UseDevelopmentStorage=true`

### Serper API errors
- Verify your `SERPER_API_KEY` is correct in `apps/api/local.settings.json`
- Check your Serper account has available credits
- Review API logs in the Functions console

### Next.js can't connect to API
- Ensure the API is running on port 7071
- Verify `NEXT_PUBLIC_API_BASE=http://localhost:7071` in `apps/web/.env.local`
- Check CORS settings if needed

### TypeScript compilation errors
- Run `pnpm build` in `apps/api` to see detailed errors
- Ensure all dependencies are installed: `pnpm install:all`

## Ports Used

- **3000**: Next.js web app
- **7071**: Azure Functions API
- **10000**: Azurite Blob service
- **10001**: Azurite Queue service
- **10002**: Azurite Table service

## Next Steps

Once everything is running:
1. The timer trigger (`FetchDailyTimer`) runs daily at 9 AM UTC
2. Use `FetchNowHttp` to manually trigger data collection
3. Browse items on the web interface
4. Check the archive for historical data

For production deployment, see the main README.md.

