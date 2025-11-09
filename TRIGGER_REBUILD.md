# How to Trigger Static Web App Rebuild

## Option 1: Push to GitHub (Easiest)

Azure Static Web Apps automatically rebuilds when you push to the connected branch (`main`):

1. **Make a small change** (or just an empty commit):
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push origin main
   ```

2. **Or make a real change** - update a comment or add a space somewhere

3. **Check GitHub Actions** - Azure's workflow should run automatically

## Option 2: Manual Trigger in GitHub Actions

1. Go to: https://github.com/tcerrato/layofflens/actions
2. Look for a workflow named something like:
   - `Azure Static Web Apps CI/CD`
   - `azure-static-web-apps-*.yml`
3. Click on it and click **"Run workflow"** button
4. Select branch: `main`
5. Click **"Run workflow"**

## Option 3: Check Azure Portal - Overview Page

1. Go to: Static Web App → **Overview**
2. Look for:
   - **"Redeploy"** button
   - **"Sync"** button
   - **"Deployment history"** section (might have a refresh/retry option)

## Option 4: Check if Workflow File Exists

Azure should have created a workflow file. Check:

```bash
ls -la .github/workflows/azure-static-web-apps*.yml
```

If it exists, you can see how it's configured and manually trigger it.

## Quick Fix: Empty Commit

The fastest way is to push an empty commit:

```bash
git commit --allow-empty -m "Trigger Azure Static Web App rebuild"
git push origin main
```

This will trigger Azure's GitHub Actions workflow, which should use the environment variable you set.

