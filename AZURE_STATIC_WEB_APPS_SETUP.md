# Azure Static Web Apps Setup Guide

## Why This Is Better Than Storage Static Websites:
- ✅ **Free SSL/HTTPS** for custom domains (automatic)
- ✅ **Free tier** available
- ✅ **Built-in GitHub integration** (or use existing workflows)
- ✅ **Better performance** (CDN included)
- ✅ **Works with your existing Functions App**

## Setup Steps:

### Step 1: Create Static Web App in Azure Portal

1. **Azure Portal** → Create a resource → **Static Web App**

2. **Basics:**
   - Subscription: `TonyAzureSub1`
   - Resource Group: `LayoffLens`
   - Name: `layofflens-web` (or any name)
   - Plan: **Free**
   - Region: Same as your Functions App (East US)

3. **Deployment details:**
   - Source: **GitHub**
   - Organization: `tcerrato`
   - Repository: `layofflens`
   - Branch: `main`
   - (Azure will create a workflow file automatically)

4. **Build details:**
   - Build preset: **Next.js** (or Custom)
   - App location: `/apps/web` (or `/` if at root)
   - Output location: `out` (this is your Next.js export folder)
   - API location: (leave blank - you'll call your existing Function App separately)

5. Click **Create**

### Step 2: Azure Creates Workflow

Azure will:
- Add a workflow file to your repo (`.github/workflows/azure-static-web-apps-*.yml`)
- Run the first deployment automatically
- Give you a URL like: `https://<random>.azurestaticapps.net`

### Step 3: Verify It Works

1. Wait for first deployment to complete
2. Visit the Azure Static Web Apps URL
3. Your site should load with valid SSL

### Step 4: Configure Custom Domain

1. In Azure Portal: Static Web App → **Custom domains**
2. Click **+ Add**
3. Enter: `www.layofflens.com`
4. Azure will show you a CNAME target like: `www → <random>.azurestaticapps.net`

### Step 5: Update DNS in Route 53

1. Go to AWS Route 53
2. Update the CNAME record for `www`:
   - **Name:** `www`
   - **Type:** `CNAME`
   - **Value:** `<random>.azurestaticapps.net` (from Azure)
   - **TTL:** `300`

### Step 6: Wait for Validation

1. Back in Azure Portal, wait for domain to show:
   - **Status:** `Validated`
   - **HTTPS:** `Enabled` (automatic!)

2. Visit: `https://www.layofflens.com` - should work with SSL!

## Important Notes:

### Your Existing Functions App:
- Your Functions App (`layofflens-func`) stays separate
- Update `NEXT_PUBLIC_API_BASE` in your code to point to your Functions App
- Or use Azure Static Web Apps API integration (more complex)

### GitHub Workflows:
- Azure will create its own workflow file
- You can keep your existing workflows or remove them
- Azure's workflow will handle deployments automatically

### Next.js Configuration:
- Your current `next.config.mjs` with `output: 'export'` works perfectly
- No changes needed to your Next.js setup

## Cost:
- **Free tier:** 100 GB bandwidth/month, 2 GB storage
- Should be plenty for your site
- No credit card required for free tier

## Migration Path:

1. **Create Static Web App** (new resource)
2. **Test it works** with the Azure URL
3. **Add custom domain** and update DNS
4. **Verify** `www.layofflens.com` works
5. **Delete** old Storage static website setup (optional, to save costs)

## Benefits Over Current Setup:
- ✅ Free SSL (vs. needing Front Door/CDN)
- ✅ Better performance (built-in CDN)
- ✅ Automatic deployments from GitHub
- ✅ Better integration with Azure ecosystem

