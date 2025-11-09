# Enable Static Website Hosting in Azure

## Critical Step: Enable Static Website Hosting

The "InvalidUri" error means static website hosting is **not enabled** on your storage account.

## Steps to Enable:

### 1. Go to Azure Portal
- Navigate to: https://portal.azure.com
- Go to your Storage Account: `layofflens`

### 2. Enable Static Website
1. In the left menu, scroll down to **"Data management"**
2. Click **"Static website"**
3. Click **"Enabled"** toggle (should turn blue/on)
4. Set **Index document name** to: `index.html`
5. Set **Error document path** to: `404.html` (optional)
6. Click **"Save"** at the top

### 3. Get Your Static Website URL
After saving, Azure will show you a **Primary endpoint** URL like:
```
https://layofflens.z13.web.core.windows.net
```

**Important:** This is different from the blob storage URL. This is the static website endpoint.

### 4. Configure Custom Domain (if using www.layofflens.com)

If you're using a custom domain:

1. In the same "Static website" section, you'll see **"Custom domain"**
2. Click **"Add custom domain"**
3. Enter: `www.layofflens.com`
4. Follow the DNS verification steps

### 5. Update DNS (in AWS Route 53)

Since your domain is in AWS Route 53:

1. Go to AWS Route 53
2. Find your hosted zone for `layofflens.com`
3. Create/update a **CNAME** record:
   - **Name:** `www`
   - **Type:** CNAME
   - **Value:** `layofflens.z13.web.core.windows.net` (use your actual endpoint from step 3)
   - **TTL:** 300

### 6. Test

1. **Test the static website endpoint directly:**
   - Visit: `https://layofflens.z13.web.core.windows.net` (your actual endpoint)
   - This should work immediately

2. **Test your custom domain:**
   - Visit: `https://www.layofflens.com`
   - This may take a few minutes for DNS to propagate

## Quick Fix via Azure CLI:

If you prefer command line:

```bash
az storage blob service-properties update \
  --account-name layofflens \
  --static-website \
  --404-document 404.html \
  --index-document index.html
```

This will enable static website hosting and set the default documents.

## Verify It's Working:

After enabling, check:
1. Go to Storage Account → Containers → `$web`
2. You should see `index.html` in the root
3. The static website endpoint should work

If you still get "InvalidUri" after enabling:
- Wait 1-2 minutes for changes to propagate
- Clear browser cache
- Try the static website endpoint directly (not custom domain)

