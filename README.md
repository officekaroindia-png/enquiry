# EnquiryCRM — Full Stack Setup & Deploy Guide

## Project Structure
```
enquiry-crm-fullstack/
├── server/          ← Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/db.js          ← MongoDB connection
│   │   ├── models/
│   │   │   ├── User.js           ← Auth model
│   │   │   └── Enquiry.js        ← Enquiry + activities model
│   │   ├── middleware/auth.js    ← JWT middleware
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── enquiryController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── enquiries.js
│   │   └── index.js              ← Express app entry
│   └── .env.example
└── client/          ← React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── auth/AuthPage.jsx
    │   │   ├── layout/Sidebar.jsx, Header.jsx
    │   │   ├── enquiry/            ← All enquiry UI
    │   │   └── ui/                 ← Shared primitives
    │   ├── hooks/
    │   │   ├── useAuth.jsx         ← Login/register state
    │   │   ├── useEnquiries.js     ← All API calls
    │   │   └── useTheme.js
    │   ├── data/stages.js          ← Stage colors config
    │   └── utils/api.js            ← Axios with JWT
    └── .env.example
```

---

## Step 1 — MongoDB Atlas (free database)

1. Go to https://cloud.mongodb.com → Create free account
2. Create a free M0 cluster (any region)
3. Add a database user: Security → Database Access → Add New User
   - Username: `crmuser`, Password: something strong
4. Allow all IPs: Security → Network Access → Add IP → 0.0.0.0/0
5. Get your connection string: Connect → Drivers → copy the URI
   - It looks like: `mongodb+srv://crmuser:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add database name: `...mongodb.net/enquiry-crm?retryWrites=true&w=majority`

---

## Step 2 — Run Locally

### Backend
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and a strong JWT_SECRET
npm install
npm run dev
# Server starts on http://localhost:5000
```

### Frontend
```bash
cd client
cp .env.example .env
# .env already has VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
# App opens at http://localhost:5173
```

### Open http://localhost:5173 → Register your account → Start adding enquiries

---

## Step 3 — Deploy to Production (Free)

### Option A: Railway (Recommended — Easiest)

**Deploy backend:**
1. Go to https://railway.app → Sign up with GitHub
2. New Project → Deploy from GitHub repo (push your code to GitHub first)
3. Select the `server` folder as root, or use monorepo settings
4. Add environment variables in Railway dashboard:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://crmuser:password@cluster0.xxxxx.mongodb.net/enquiry-crm?retryWrites=true&w=majority
   JWT_SECRET=your_super_long_random_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
5. Railway gives you a URL like `https://your-app.railway.app`

**Deploy frontend:**
1. Go to https://vercel.com → Sign up with GitHub
2. Import your repo → set Root Directory to `client`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
4. Deploy → Vercel gives you `https://your-app.vercel.app`
5. Go back to Railway → update `CLIENT_URL` to your Vercel URL

---

### Option B: Render (also free)

**Backend on Render:**
1. https://render.com → New Web Service
2. Connect GitHub repo → Root directory: `server`
3. Build command: `npm install`
4. Start command: `node src/index.js`
5. Add environment variables (same as Railway above)
6. Free tier spins down after inactivity (first request takes ~30s)

**Frontend on Render:**
1. New Static Site → Root directory: `client`
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`

---

### Option C: VPS (DigitalOcean / Hetzner) — Best for production

```bash
# On your server
git clone your-repo
cd enquiry-crm-fullstack

# Install Node
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Setup server
cd server && npm install
cp .env.example .env && nano .env   # fill in values

# Install PM2 to keep server running
npm install -g pm2
pm2 start src/index.js --name crm-api
pm2 startup && pm2 save

# Build frontend
cd ../client && npm install
echo "VITE_API_URL=https://yourdomain.com/api" > .env
npm run build
# Copy dist/ to nginx public folder

# Install nginx
sudo apt install nginx
# Point /api to localhost:5000, serve client/dist for everything else
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login, get JWT |
| GET  | /api/auth/me | Get current user |
| GET  | /api/enquiries | List all enquiries |
| POST | /api/enquiries | Create enquiry |
| PUT  | /api/enquiries/:id | Update contact info |
| PATCH| /api/enquiries/:id/activity | Log activity + move stage |
| PATCH| /api/enquiries/:id/close-won | Close as Won (Payment stage only) |
| PATCH| /api/enquiries/:id/close-lost | Close as Lost (any stage) |
| GET  | /api/enquiries/stats | Stage counts |
| DELETE| /api/enquiries/:id | Delete enquiry |

---

## Stage Rules (enforced in backend)
- Can only move **forward** through stages (backend validates this)
- Can **Close as Lost** from any active stage
- Can **Close as Won** only from Payment stage
- Once closed, no further stage changes allowed
