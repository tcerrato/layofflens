# Custom Domain Setup for Azure Storage Static Website

## Current Status:
✅ AWS Route 53 DNS is configured correctly
- `www.layofflens.com` → `layofflens.z13.web.core.windows.net`

## Azure Storage Static Websites and Custom Domains:

Azure Storage static websites **don't have a built-in custom domain feature** in the portal. You have two options:

### Option 1: DNS Only (Simplest - What You Have Now)

Since your DNS is already pointing to the static website endpoint, it **should work** without any Azure configuration:

1. **Test DNS resolution:**
   ```bash
   nslookup www.layofflens.com
   ```
   Should return: `layofflens.z13.web.core.windows.net`

2. **Test the domain:**
   - Visit: `https://www.layofflens.com`
   - If it works → You're done! No Azure configuration needed.

3. **If you get SSL/certificate errors:**
   - Azure Storage static websites use a wildcard certificate for `*.web.core.windows.net`
   - Your custom domain won't have SSL by default
   - You'll need Option 2 (Azure Front Door/CDN) for HTTPS

### Option 2: Azure Front Door or CDN (For HTTPS)

If you want HTTPS on your custom domain, you need to add Azure Front Door or Azure CDN:

**Azure Front Door:**
1. Create an Azure Front Door profile
2. Add an origin pointing to your static website endpoint
3. Add a custom domain (`www.layofflens.com`)
4. Azure will provide SSL certificate automatically
5. Update DNS to point to Front Door endpoint instead

**Azure CDN:**
1. Create an Azure CDN profile
2. Add an endpoint with your storage account as origin
3. Enable custom domain
4. Configure SSL certificate
5. Update DNS to point to CDN endpoint

## Recommendation:

**Try Option 1 first:**
1. Test if `https://www.layofflens.com` works (might show certificate warning)
2. If it works but shows "Not Secure" → You need Option 2 for HTTPS
3. If it doesn't work at all → Check DNS propagation (can take 5-60 minutes)

## Quick Test:

```bash
# Test DNS
nslookup www.layofflens.com

# Test HTTP (might work)
curl http://www.layofflens.com

# Test HTTPS (might show cert error)
curl https://www.layofflens.com
```

## If You Need HTTPS:

You'll need to set up Azure Front Door or CDN. This is a separate Azure resource and requires additional configuration.

