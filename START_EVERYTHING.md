# 🚀 Complete Setup Guide - Run Everything

## Quick Start (3 Steps)

### Step 1: Start Backend ✅

Open **Terminal 1** (PowerShell or Command Prompt):

```powershell
cd digital-fortress-backend
npm run dev
```

**Wait for:** `Server running in development mode on port 5000`

---

### Step 2: Start Frontend ✅

Open **Terminal 2** (NEW terminal window):

```powershell
cd D:\coding\Digital-fortress
npm run dev
```

**Wait for:** `➜  Local:   http://localhost:8080/`

---

### Step 3: Open in Browser ✅

Open your browser and go to:
**http://localhost:8080**

---

## 🎉 That's It!

You should now see:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 8080
- ✅ Application accessible in browser

---

## 📋 Detailed Step-by-Step

### Terminal 1: Backend Setup

```powershell
# Navigate to backend
cd D:\coding\Digital-fortress\digital-fortress-backend

# Check if .env exists (should already be created)
# If not, run: npm run setup-env

# Start backend server
npm run dev
```

**Expected Output:**
```
MongoDB Connected: digitalfortresscluster-shard-00-00.aied9ph.mongodb.net
Server running in development mode on port 5000
```

**✅ Keep this terminal open!** Backend must keep running.

---

### Terminal 2: Frontend Setup

```powershell
# Navigate to project root
cd D:\coding\Digital-fortress

# Make sure dependencies are installed
npm install

# Start frontend development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:8080/
```

**✅ Keep this terminal open!** Frontend must keep running.

---

### Browser: Access Application

1. Open any browser (Chrome, Edge, Firefox)
2. Go to: **http://localhost:8080**
3. You should see the Digital Fortress homepage!

---

## 🧪 Test Features

### 1. Test Backend Health
Open in browser: **http://localhost:5000/api/health**
Should show: `{"success":true,"message":"Digital Fortress API is running"}`

### 2. Test Frontend
- Click "Community" → See posts
- Click "Register" → Create account
- Click "Wi-Defend" → Test Wi-Fi scan
- Click "Fraud Detector" → Test fraud detection

---

## 🔧 Optional: Seed Sample Data

### Seed Users & Posts:
```powershell
# In Terminal 1 (backend terminal)
cd digital-fortress-backend
npm run seed
```

### Seed Scam Database:
```powershell
# In Terminal 1 (backend terminal)
npm run seed-scams
```

---

## ⚠️ Troubleshooting

### Backend Won't Start

**Port 5000 already in use:**
```powershell
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB connection error:**
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas IP is whitelisted

### Frontend Won't Start

**Port 8080 already in use:**
- Close other applications using port 8080
- Or change port in `vite.config.ts`

**Vite not found:**
```powershell
npm install
```

### Can't Connect Frontend to Backend

**CORS Error:**
- Backend CORS is already configured
- Make sure backend is running
- Check browser console (F12) for errors

**404 Errors:**
- Verify backend is on port 5000
- Check API URL in frontend code

---

## 📊 Verify Everything Works

### Backend Endpoints:
- ✅ http://localhost:5000/api/health
- ✅ http://localhost:5000/api/get_scams
- ✅ http://localhost:5000/api/stats

### Frontend Pages:
- ✅ http://localhost:8080 (Homepage)
- ✅ http://localhost:8080/community (Community)
- ✅ http://localhost:8080/wi-defend (Wi-Fi Scanner)
- ✅ http://localhost:8080/fraud-detector (Fraud Detector)

---

## 🎯 Quick Commands Reference

```powershell
# Backend
cd digital-fortress-backend
npm run dev          # Start backend
npm run seed         # Seed users/posts
npm run seed-scams   # Seed scams
npm run test-all     # Test all endpoints

# Frontend
cd D:\coding\Digital-fortress
npm run dev          # Start frontend
npm install          # Install dependencies
```

---

## ✅ Success Checklist

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] Frontend terminal shows "Local: http://localhost:8080"
- [ ] Browser opens http://localhost:8080 successfully
- [ ] Can see homepage
- [ ] Can navigate to different pages
- [ ] Can register/login (if testing auth)
- [ ] Backend API responds (test /api/health)

---

## 🎉 You're Ready!

Everything should be running now:
- ✅ Backend: Port 5000
- ✅ Frontend: Port 8080
- ✅ Database: MongoDB Atlas connected
- ✅ All routes working
- ✅ Full application functional

Start exploring your Digital Fortress application! 🚀

