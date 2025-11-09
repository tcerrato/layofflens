# Fixing Deployment Permission Issues

## Issue 1: Functions - Language Detection

**Problem:** `func` command can't determine project language

**Fixed:** Added `--typescript` flag explicitly

---

## Issue 2: Static Site - Storage Permissions

**Problem:** Service Principal doesn't have "Storage Blob Data Contributor" role

**Solution:** Two options:

### Option A: Add Storage Connection String to GitHub Secrets (Quick Fix)

1. Go to: GitHub repo → Settings → Secrets and variables → Actions
2. Add new secret:
   - **Name:** `AZURE_STORAGE_CONNECTION_STRING`
   - **Value:** (Your storage account connection string from Azure Portal)
3. The workflow will use connection string authentication instead of managed identity

### Option B: Assign Storage Blob Data Contributor Role (Proper Fix)

1. Go to: Azure Portal → Storage Account `layofflens` → Access control (IAM)
2. Click: **Add role assignment**
3. **Role:** `Storage Blob Data Contributor`
4. **Assign access to:** `Service principal`
5. **Select:** The service principal you created (name should include "layofflens-github-actions")
6. Click: **Save**

**To find your Service Principal:**
- Azure Portal → Azure Active Directory → App registrations
- Look for the one with "layofflens-github-actions" in the name

---

## Recommended: Use Option A (Connection String)

I've updated the workflow to use connection string authentication, which is simpler and doesn't require role assignments.

Just add `AZURE_STORAGE_CONNECTION_STRING` to GitHub Secrets and it will work.

---

## Next Steps:

1. Add `AZURE_STORAGE_CONNECTION_STRING` to GitHub Secrets (if using Option A)
2. OR assign Storage Blob Data Contributor role (if using Option B)
3. Push the updated workflows
4. Re-run the workflows

