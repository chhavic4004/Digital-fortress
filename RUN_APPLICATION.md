# 🚀 How to Run Your Complete Application

## 🎯 Simple Method (Recommended)

### Step 1: Open TWO Terminal Windows

**Terminal 1 - Backend:**
```powershell
# In PowerShell, run:
cd D:\coding\Digital-fortress
.\start-backend.ps1
```

**Terminal 2 - Frontend:**
```powershell
# In NEW PowerShell window, run:
cd D:\coding\Digital-fortress
.\start-frontend.ps1
```

---

## 📋 Manual Method (Step by Step)

### Terminal 1: Start Backend

1. Open PowerShell
2. Navigate to project:
   ```powershell
   cd D:\coding\Digital-fortress\digital-fortress-backend
   ```
3. Start server:
   ```powershell
   npm run dev
   ```
4. **Wait for:** `Server running in development mode on port 5000`
5. ✅ **Keep this terminal open!**

---

### Terminal 2: Start Frontend

1. Open **NEW** PowerShell window
2. Navigate to project root:
   ```powershell
   cd D:\coding\Digital-fortress
   ```
3. Start frontend:
   ```powershell
   npm run dev
   ```
4. **Wait for:** `Local: http://localhost:8080/`
5. ✅ **Keep this terminal open!**

---

### Step 3: Open Browser

1. Open any browser
2. Go to: **http://localhost:8080**
3. 🎉 You should see Digital Fortress!

---

## ✅ What You Should See

### Terminal 1 (Backend):
```
MongoDB Connected: digitalfortresscluster-shard-00-00.aied9ph.mongodb.net
Server running in development mode on port 5000
```

### Terminal 2 (Frontend):
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:8080/
```

### Browser:
- Digital Fortress homepage
- Navigation menu
- All pages accessible

---

## 🧪 Quick Tests

### Test Backend:
Open: **http://localhost:5000/api/health**
Should show: `{"success":true,"message":"Digital Fortress API is running"}`

### Test Frontend:
1. Click "Community" → Should load posts
2. Click "Wi-Defend" → Should show Wi-Fi scanner
3. Click "Fraud Detector" → Should show analyzer
4. Click "Register" → Should open auth dialog

---

## 🐛 Troubleshooting

### ❌ Backend: "Port 5000 already in use"
**Fix:**
```powershell
# Find process
netstat -ano | findstr :5000
# Kill it (replace PID)
taskkill /PID <PID> /F
# Restart backend
```

### ❌ Frontend: "Port 8080 already in use"
**Fix:** Close other applications using port 8080, or restart computer

### ❌ Backend: "Cannot connect to MongoDB"
**Fix:**
1. Check `.env` file in `digital-fortress-backend` folder
2. Verify `MONGO_URI` is correct
3. Check MongoDB Atlas IP whitelist

### ❌ Frontend: "Cannot connect to backend"
**Fix:**
1. Make sure backend is running (check Terminal 1)
2. Test: `curl http://localhost:5000/api/health`
3. Check browser console (F12) for errors

---

## 🎯 Quick Commands

### Backend:
```powershell
cd digital-fortress-backend
npm run dev          # Start
npm run seed         # Add sample data
npm run seed-scams   # Add sample scams
```

### Frontend:
```powershell
cd D:\coding\Digital-fortress
npm run dev          # Start
npm install          # If needed
```

---

## 📊 Status Check

**Backend Running?**
- Check Terminal 1 shows "Server running"
- Test: http://localhost:5000/api/health

**Frontend Running?**
- Check Terminal 2 shows "Local: http://localhost:8080"
- Test: Open http://localhost:8080 in browser

**Database Connected?**
- Check Terminal 1 shows "MongoDB Connected"

---

## ✅ Success Checklist

- [ ] Terminal 1: Backend running (port 5000)
- [ ] Terminal 2: Frontend running (port 8080)
- [ ] Browser: Can access http://localhost:8080
- [ ] Backend API responds (test /api/health)
- [ ] Can navigate frontend pages
- [ ] Can see Community posts (if seeded)

---

## 🎉 You're All Set!

Once both terminals show the success messages and browser loads:
- ✅ **Backend:** Running and connected to MongoDB
- ✅ **Frontend:** Running and accessible
- ✅ **Full Stack:** Complete application ready to use!

**Start using your Digital Fortress application!** 🚀

