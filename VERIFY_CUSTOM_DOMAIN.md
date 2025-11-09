# Verify Custom Domain Setup

## Current Status:
✅ Static website hosting is **ENABLED**
✅ Primary endpoint: `https://layofflens.z13.web.core.windows.net/`
✅ Index document: `index.html`

## Issue:
Still getting "InvalidUri" when accessing `www.layofflens.com`

## Troubleshooting Steps:

### 1. Test the Primary Endpoint Directly

First, test if the static website works at all:

**Visit:** `https://layofflens.z13.web.core.windows.net/`

- ✅ **If this works:** The issue is with your custom domain configuration
- ❌ **If this doesn't work:** The issue is with file uploads or container

### 2. Verify Files Are in $web Container

In Azure Portal:
1. Go to: Storage Account `layofflens` → Containers → `$web`
2. Check if you see:
   - `index.html` (in root, not in a subfolder)
   - `archive.html`
   - `404.html`
   - `_next/` folder

**If files are missing:**
- Check GitHub Actions logs to see if upload succeeded
- Re-run the deployment workflow

### 3. Configure Custom Domain (if not done)

In Azure Portal:
1. Go to: Storage Account → Static website
2. Scroll down to **"Custom domain"** section
3. Click **"Add custom domain"**
4. Enter: `www.layofflens.com`
5. Follow the verification steps

**Important:** Azure will show you DNS verification instructions.

### 4. Update DNS in AWS Route 53

Since your domain is in AWS Route 53:

1. Go to AWS Route 53 Console
2. Find your hosted zone for `layofflens.com`
3. Check if you have a CNAME record for `www`:
   - **Name:** `www`
   - **Type:** CNAME
   - **Value:** `layofflens.z13.web.core.windows.net` (your static website endpoint)
   - **TTL:** 300

**If the record doesn't exist or is wrong:**
- Create/update the CNAME record
- Wait 5-10 minutes for DNS propagation

### 5. Common Issues:

**Issue A: Using wrong endpoint in DNS**
- ❌ Wrong: `layofflens.blob.core.windows.net` (blob endpoint)
- ✅ Correct: `layofflens.z13.web.core.windows.net` (static website endpoint)

**Issue B: DNS not propagated**
- DNS changes can take 5-60 minutes
- Use `nslookup www.layofflens.com` to check if DNS is correct

**Issue C: Custom domain not added in Azure**
- Azure needs the custom domain to be explicitly added
- Just having DNS isn't enough

### 6. Quick Test Commands:

```bash
# Check DNS resolution
nslookup www.layofflens.com

# Should return: layofflens.z13.web.core.windows.net

# Test static website endpoint directly
curl https://layofflens.z13.web.core.windows.net/

# Should return HTML content
```

