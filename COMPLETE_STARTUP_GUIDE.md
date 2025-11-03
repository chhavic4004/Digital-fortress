# 🚀 Complete Startup Guide - Digital Fortress

## ✅ Current Status Check

**Backend:** Should be running on port 5000  
**Frontend:** Should be running on port 8080

---

## 🎯 Quick Access

### 1. Open Your Application
**In your browser, go to:**
```
http://localhost:8080
```

You should see the **Digital Fortress homepage**!

---

## 📋 All Available Pages

Once in the browser at `http://localhost:8080`, you can access:

1. **Homepage:** `http://localhost:8080/`
2. **Community:** `http://localhost:8080/community` - View and create posts
3. **Wi-Defend:** `http://localhost:8080/wi-defend` - Wi-Fi network scanner
4. **Fraud Detector:** `http://localhost:8080/fraud-detector` - Message/call analyzer
5. **Scam Database:** `http://localhost:8080/scam-database` - Browse reported scams
6. **Awareness:** `http://localhost:8080/awareness` - Learning hub
7. **Browser Extension:** `http://localhost:8080/browser-extension` - Extension info
8. **AI Engine:** `http://localhost:8080/ai-engine` - AI system info

---

## 🔧 If Something's Not Running

### Backend Not Running?
```powershell
cd D:\coding\Digital-fortress\digital-fortress-backend
npm run dev
```

**Wait for:**
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

### Frontend Not Running?
```powershell
cd D:\coding\Digital-fortress
npm run dev
```

**Wait for:**
```
➜  Local:   http://localhost:8080/
```

---

## 🧪 Test All Features

### 1. Test Registration/Login
- Click **"Register"** button (top right)
- Create an account
- Try logging in

### 2. Test Community
- Go to `/community`
- Click **"Share Your Story"** (when logged in)
- Create a post
- Try liking posts

### 3. Test Wi-Defend
- Go to `/wi-defend`
- Click **"Start Wi-Fi Scan"**
- Should analyze and show results

### 4. Test Fraud Detector
- Go to `/fraud-detector`
- Paste a suspicious message
- Click **"Analyze for Fraud"**
- Should show risk analysis

### 5. Test Backend APIs
Open these in browser:
- `http://localhost:5000/api/health` ✅
- `http://localhost:5000/api/get_scams` ✅
- `http://localhost:5000/api/stats` ✅

---

## 📊 Seed Sample Data (Optional)

To see example data:

```powershell
# In backend terminal
cd digital-fortress-backend
npm run seed        # Adds 4 users and 4 posts
npm run seed-scams  # Adds 8 sample scams
```

Then:
- Login with: `priya@example.com` / `password123`
- See sample posts in Community
- See sample scams in Scam Database

---

## 🎯 What to Do Right Now

1. **Open Browser:** http://localhost:8080
2. **Check if it loads:** You should see homepage
3. **Try features:**
   - Navigate to Community
   - Try Wi-Defend scanner
   - Try Fraud Detector
   - Register and create a post

---

## ✅ Success Indicators

**Everything is working if:**
- ✅ Browser shows Digital Fortress homepage
- ✅ Can navigate between pages
- ✅ Backend API responds (test /api/health)
- ✅ Can register/login
- ✅ Can create posts (when logged in)
- ✅ Wi-Defend shows scan results
- ✅ Fraud Detector analyzes messages

---

## 🐛 Troubleshooting

### "Cannot connect" errors
- Make sure **both** backend AND frontend terminals are running
- Check browser console (F12) for errors
- Verify ports: Backend=5000, Frontend=8080

### Features not working
- Check backend is running: `curl http://localhost:5000/api/health`
- Check browser console (F12) for API errors
- Make sure you're logged in for protected features

### Pages not loading
- Refresh browser (Ctrl+R or F5)
- Clear browser cache
- Check terminal for errors

---

## 🎉 You're Ready!

**Just open:** http://localhost:8080

And start exploring your complete Digital Fortress application!

