# Client-Side Data Fetching Explained

## What Changed:

I added a `FeedClient` component that fetches data **when users visit the site** (client-side), in addition to the build-time data.

## Why This Is Better:

### Before (Build-Time Only):
- ✅ Fast initial load (data is in HTML)
- ❌ Data can be stale (only as fresh as the last build)
- ❌ If API fails during build, site shows empty forever
- ❌ Requires rebuilding to get new data

### After (Build-Time + Client-Side):
- ✅ Fast initial load (uses build-time data if available)
- ✅ **Fresh data on every visit** (fetches from API if build-time data is empty)
- ✅ Works even if API was down during build
- ✅ Users always see latest content

## How It Works:

1. **Build Time:** Next.js tries to fetch data and bake it into the HTML
   - If successful → users see data immediately (fast!)
   - If fails → HTML has empty data, but page still loads

2. **User Visits:** Browser loads the page
   - If build-time data exists → shows it immediately (instant!)
   - If build-time data is empty → automatically fetches fresh data from API
   - Shows a loading spinner while fetching

## Is This What You Want?

**Option A: Client-Side Fetching (Current Change)**
- ✅ Always shows fresh data
- ✅ Works even if build fails
- ⚠️ Slight delay on first visit if build-time data is empty
- ✅ Best for frequently updated content

**Option B: Build-Time Only (Revert Change)**
- ✅ Instant load (all data in HTML)
- ❌ Data can be stale
- ❌ Requires rebuild to update
- ✅ Best for rarely changing content

**My Recommendation:** Keep client-side fetching because:
- Your content updates daily (layoff news)
- Users expect fresh data
- The slight delay is worth it for accuracy

## Do You Want to Keep This Change?

If you prefer build-time only (no client-side fetching), I can revert it. Just let me know!

---

## AWS Domain Configuration (Separate Issue)

The "no articles" issue is separate from the custom domain issue.

### For Custom Domain (`www.layofflens.com`):

You need to configure DNS in **AWS Route 53**:

1. Go to AWS Route 53 Console
2. Find your hosted zone for `layofflens.com`
3. Create/update a **CNAME** record:
   - **Name:** `www`
   - **Type:** CNAME
   - **Value:** `layofflens.z13.web.core.windows.net` (your static website endpoint)
   - **TTL:** 300

4. **Also add the custom domain in Azure:**
   - Go to: Storage Account → Static website → Custom domain
   - Click "Add custom domain"
   - Enter: `www.layofflens.com`
   - Follow verification steps

### Test Your Domain:

```bash
# Check DNS resolution
nslookup www.layofflens.com

# Should return: layofflens.z13.web.core.windows.net
```

Once DNS is configured correctly, `www.layofflens.com` will work just like the primary endpoint.

