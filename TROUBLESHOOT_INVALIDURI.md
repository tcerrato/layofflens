# Troubleshooting InvalidUri Error

## Problem:
Even though `index.html` is being generated, Azure Storage is returning "InvalidUri" error.

## Possible Causes:

1. **Static Website Hosting Not Enabled**
   - Azure Storage static website hosting must be explicitly enabled
   - Default document must be set to `index.html`

2. **Files Not Uploaded Correctly**
   - Files might be in wrong container
   - Files might have wrong paths

3. **Domain/DNS Configuration**
   - Custom domain might not be configured correctly
   - DNS might not be pointing to the right endpoint

## Steps to Fix:

### 1. Verify Static Website Hosting is Enabled

In Azure Portal:
1. Go to your Storage Account (`layofflens`)
2. Click on "Data management" → "Static website"
3. **Enable** static website hosting
4. Set **Index document name** to: `index.html`
5. Set **Error document path** to: `404.html`
6. Click **Save**

### 2. Check the Primary Endpoint

After enabling static website hosting, Azure will show you a **Primary endpoint** URL like:
- `https://layofflens.z13.web.core.windows.net`

This is different from the blob storage URL. You should use this endpoint for your custom domain.

### 3. Verify Files Are Uploaded

Check the `$web` container:
- Should contain `index.html` in root
- Should contain `archive.html`
- Should contain `404.html`
- Should contain `_next/` directory

### 4. Test the Primary Endpoint Directly

Try accessing:
- `https://layofflens.z13.web.core.windows.net` (replace with your actual endpoint)

If this works but your custom domain doesn't, it's a DNS/domain configuration issue.

### 5. Check Custom Domain Configuration

If using a custom domain (`www.layofflens.com`):
- DNS should point to the static website endpoint (not the blob endpoint)
- CNAME record should point to: `layofflens.z13.web.core.windows.net`

## Quick Fix Command (Azure CLI):

```bash
# Enable static website hosting
az storage blob service-properties update \
  --account-name layofflens \
  --static-website \
  --404-document 404.html \
  --index-document index.html
```

