# 🚀 Deployment Guide - Render

This guide will walk you through deploying your E-Procurement Portal on Render.

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ GitHub repository (already done!)
- ✅ MongoDB Atlas account with database created
- ✅ Render account (sign up at [render.com](https://render.com))

## 🗄️ Step 1: Prepare MongoDB Atlas

1. **Go to MongoDB Atlas** ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
2. **Navigate to Network Access**
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
   
3. **Get your connection string**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Keep this handy for Render setup

## 🌐 Step 2: Deploy on Render

### Option A: Deploy via Dashboard (Recommended)

1. **Sign up/Login to Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Krishna-Sahu0-0/e-Procurement-Website`
   - Click "Connect"

3. **Configure Service Settings**
   ```
   Name:               e-procurement-portal
   Region:             Oregon (US West) or closest to you
   Branch:             main
   Root Directory:     (leave empty)
   Runtime:            Node
   Build Command:      cd Server && npm install && npm run build
   Start Command:      cd Server && npm start
   Instance Type:      Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add these:
   
   ```
   Key: NODE_ENV
   Value: production
   
   Key: PORT
   Value: 10000
   
   Key: MONGO_URI
   Value: mongodb+srv://your_username:your_password@your_cluster.mongodb.net/eprocurement
   (Use your actual MongoDB connection string)
   
   Key: JWT_SECRET
   Value: (Generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for the build to complete
   - Your app will be live at: `https://e-procurement-portal.onrender.com`

### Option B: Deploy via render.yaml (Alternative)

1. **Push render.yaml to GitHub** (already done!)
2. **Go to Render Dashboard**
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml`
3. **Add Environment Variables** (same as Option A)
4. **Deploy**

## 🔧 Step 3: Create Admin User

After deployment, you need to create an admin user:

1. **SSH into Render Service** (via Render Dashboard)
   - Go to your service → "Shell" tab
   - Run:
   ```bash
   cd Server
   node createAdmin.js
   ```

2. **Or use MongoDB Compass/Atlas directly**
   - Connect to your MongoDB
   - Go to `eprocurement` database → `admins` collection
   - Manually create an admin document (password: use bcrypt hash)

**Default Admin Credentials:**
- Email: `admin@eprocurement.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password after first login!

## ✅ Step 4: Verify Deployment

1. **Visit your deployed URL**
   - Example: `https://e-procurement-portal.onrender.com`
   
2. **Test the following:**
   - ✅ Homepage loads correctly
   - ✅ Vendor registration works
   - ✅ Vendor login works
   - ✅ Admin login works
   - ✅ Create tender (Admin)
   - ✅ Submit bid (Vendor)
   - ✅ All pages are responsive on mobile

3. **Check Render Logs**
   - Go to Render Dashboard → Your Service → "Logs"
   - Look for: `Server running on port 10000`
   - Check for any errors

## 🐛 Troubleshooting

### Build Failed
**Error:** `npm install failed`
- **Solution:** Check `Server/package.json` is correct
- **Solution:** Ensure Node version is compatible (use Node 18+)
- In Render, go to Settings → Set Node version: `18.x`

### Database Connection Error
**Error:** `MongoServerError: bad auth`
- **Solution:** Double-check `MONGO_URI` in Render environment variables
- **Solution:** Ensure password has no special characters (or URL encode them)
- **Solution:** Verify IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)

### Build Takes Too Long
**Issue:** Build timeout or takes 10+ minutes
- **Solution:** This is normal for first deploy (installs 2 projects)
- **Solution:** Free tier may be slower - wait patiently
- **Solution:** Subsequent deploys will be faster (cached)

### 404 on Routes
**Error:** Refresh shows 404 on routes like `/vendor-dashboard`
- **Solution:** Already handled in `server.js` with:
  ```javascript
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/build/index.html'));
  });
  ```

### API Calls Failing
**Error:** `Network Error` or `CORS error`
- **Solution:** Check if backend is running (view Render logs)
- **Solution:** Verify API endpoints start with `/api/`
- **Solution:** CORS is already configured in `server.js`

## 🔄 Updating Your Live Site

Whenever you make changes:

```bash
# Commit changes
git add .
git commit -m "Your update message"

# Push to GitHub
git push origin main
```

Render will **automatically** detect the push and redeploy! 🎉

## 📊 Monitoring

**Render Dashboard** shows:
- 📈 CPU/Memory usage
- 📝 Deployment logs
- 🔍 Error tracking
- ⏱️ Response times

**Free Tier Limitations:**
- ⚠️ Service spins down after 15 min of inactivity
- ⚠️ First request after sleep takes 30-60 seconds (cold start)
- ⚠️ 750 hours/month free compute

**Upgrade to Paid:** $7/month for always-on service

## 🔐 Security Checklist

Before going live:
- ✅ Changed default admin password
- ✅ MongoDB IP whitelist configured
- ✅ Strong JWT_SECRET generated
- ✅ `.env` file NOT in Git (already protected)
- ✅ HTTPS enabled (Render provides free SSL)
- ✅ CORS configured for your domain

## 🎉 Success!

Your E-Procurement Portal is now live!

**Share your live URL:**
- Add it to your GitHub README
- Add it to your LinkedIn/portfolio
- Share with potential employers

## 📧 Support

If you encounter issues:
1. Check Render logs first
2. Review MongoDB Atlas connection
3. Verify environment variables
4. Check GitHub repository is public

---

**Made with ❤️ - Happy Deploying! 🚀**
