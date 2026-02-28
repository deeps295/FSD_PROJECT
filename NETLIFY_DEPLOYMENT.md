# Netlify Full-Stack Deployment Guide

Your Employee Management System is now configured for deployment entirely on Netlify using serverless functions!

## Project Structure

```
EMPLOYEE/
├── client/                    # React frontend (builds to client/build)
├── netlify/
│   └── functions/            # Serverless API functions
│       ├── auth-login.ts
│       ├── auth-register.ts
│       ├── auth-me.ts
│       ├── employees.ts
│       ├── employees-id.ts
│       ├── attendance.ts
│       ├── attendance-punch.ts
│       ├── leaves.ts
│       └── leaves-id-action.ts
├── server/
│   └── src/
│       └── lib/              # Shared utilities for functions
│           ├── types.ts
│           ├── store.ts      # In-memory data store
│           └── auth.ts       # JWT utilities
├── netlify.toml              # Netlify configuration
└── .env                       # Environment variables
```

## Prerequisites

1. **GitHub Account** - Required to connect with Netlify
2. **Netlify Account** - Sign up at https://netlify.com (free tier available)
3. **Git** - For version control

## Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

```powershell
# Initialize Git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial employee management system with Netlify functions"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Select **GitHub** and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Base directory:** *(leave empty or use root)*
   - **Build command:** `cd client && npm run build`
   - **Publish directory:** `client/build`
   - **Functions directory:** `netlify/functions`

### Step 3: Set Environment Variables in Netlify

1. In Netlify Dashboard → Go to your site
2. Site Settings → Build & Deploy → **Environment**
3. Add these variables:
   ```
   JWT_SECRET = your-super-secret-jwt-key-change-in-production
   ```

4. *(Optional) For production, use a strong random secret:*
   ```
   JWT_SECRET = $(openssl rand -base64 32)
   ```

### Step 4: Deploy

1. Netlify automatically deploys when you push to GitHub
2. Monitor build progress in Netlify Dashboard
3. Once deployed, you'll get a live URL like: `https://your-site-name.netlify.app`

## Local Testing Before Deployment

### Test Production Build Locally

```powershell
# Build the frontend
cd client
npm run build

# Build the server/functions
cd ../netlify/functions
npm install
npx tsc

# Test with Netlify CLI (optional)
npm install -g netlify-cli
netlify dev
```

Open `http://localhost:8888` to test locally.

## Features & API Endpoints

All API calls are now handled by serverless functions:

| Endpoint | Function | Method |
|----------|----------|--------|
| `/api/auth/login` | `auth-login.ts` | POST |
| `/api/auth/register` | `auth-register.ts` | POST |
| `/api/auth/me` | `auth-me.ts` | GET |
| `/api/employees` | `employees.ts` | GET, POST |
| `/api/employees/:id` | `employees-id.ts` | PUT, DELETE |
| `/api/attendance` | `attendance.ts` | GET, POST |
| `/api/attendance/punch` | `attendance-punch.ts` | POST |
| `/api/leaves` | `leaves.ts` | GET, POST |
| `/api/leaves/:id/approve` | `leaves-id-action.ts` | PUT |
| `/api/leaves/:id/reject` | `leaves-id-action.ts` | PUT |

## Important Notes

### Data Persistence
⚠️ **Current Implementation**: Uses in-memory storage
- Data resets on function redeploy/restart
- Perfect for demo/development

**For Production**: Integrate with:
- MongoDB Atlas (free tier available)
- PostgreSQL + Railway/Supabase
- Firebase Firestore

### Change the JWT Secret

Before deploying to production:

1. Generate a strong secret:
   ```powershell
   [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed 0 -Count 32 | % {[char]$_}) -join ''))
   ```

2. Update in Netlify Environment Variables

### Test Users

After deployment, register new users via the signup page. The first registered admin can manage other employees.

## Customization

### Add More Endpoints

1. Create new file: `netlify/functions/your-endpoint.ts`
2. Add redirect rule in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/api/your-path"
     to = "/.netlify/functions/your-endpoint"
     status = 200
     force = true
   ```
3. Push to GitHub → Auto-deploys

### Customize Build Command

Edit `netlify.toml` build command if needed (e.g., for TypeScript compilation)

## Troubleshooting

### Functions Not Working
- Check Netlify Dashboard → Functions for error logs
- Verify environment variables are set correctly
- Check `netlify.toml` paths are correct

### CORS Issues  
- Netlify functions automatically handle CORS
- Frontend and functions share the same origin

### Build Failures
- Check Netlify Deploy Logs
- Ensure all dependencies are in `package.json`
- Run local build test first

## Monitoring & Logs

1. Netlify Dashboard → Functions
2. View real-time logs and function performance
3. Analytics show API call patterns

## Next Steps

1. ✅ Deploy on Netlify
2. 💾 Add database integration
3. 📧 Add email notifications
4. 📱 Mobile-responsive improvements
5. 🔒 Add 2FA authentication

---

**Deployed Site URL**: `https://your-site-name.netlify.app`
**Admin Login**: Register as admin during signup
