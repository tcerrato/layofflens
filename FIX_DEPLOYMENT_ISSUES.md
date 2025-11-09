# Fixing Deployment Issues

## Issue 1: Static Site - Build Output Directory

**Problem:** `.next/out` doesn't exist

**Solution:** Next.js static export creates `out` directory (not `.next/out`)

**Fixed:** Updated workflow to use `apps/web/out` instead of `apps/web/.next/out`

---

## Issue 2: Functions - 401 Unauthorized

**Problem:** Publish profile authentication failed

**Possible Causes:**
1. Publish profile expired or invalid
2. Functions App credentials changed
3. Publish profile format issue

**Solution:** Regenerate publish profile

### Steps to Fix:

1. **Go to Azure Portal:**
   - Functions App → `layofflens-func`
   - Click **Get publish profile** (top menu)

2. **Download the new publish profile**

3. **Update GitHub Secret:**
   - Go to: GitHub repo → Settings → Secrets and variables → Actions
   - Find: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
   - Click **Update**
   - Paste the entire contents of the new `.PublishSettings` file
   - Click **Update secret**

4. **Re-run the workflow:**
   - Go to: GitHub Actions
   - Click on the failed workflow
   - Click **Re-run all jobs**

---

## Alternative: Use Azure CLI Authentication

If publish profile continues to fail, we can switch to using Azure CLI with Service Principal (which you already have set up for static site).

Let me know if you want me to update the Functions workflow to use Azure CLI instead of publish profile.

---

## Next Steps:

1. ✅ Static site workflow fixed (uses correct `out` directory)
2. ⚠️ Regenerate publish profile and update GitHub Secret
3. ⚠️ Re-run workflows

