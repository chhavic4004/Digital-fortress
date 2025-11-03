# 🚀 How to Open Your Application

## Quick Steps to Open

### Step 1: Make Sure Servers Are Running

**Backend (Port 5000):**
- Should be running in one terminal
- Check: `http://localhost:5000/api/health` should work

**Frontend (Port 8080):**
- Should be running in another terminal
- If not running, open a terminal and run:
  ```bash
  npm run dev
  ```

### Step 2: Open in Browser

**Option A: Click this link:**
👉 **http://localhost:8080**

**Option B: Manual Steps:**
1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Type in the address bar: `http://localhost:8080`
3. Press Enter

### Step 3: Navigate to Community Page

Once the homepage loads:
1. Click **"Community"** in the navigation menu (top)
2. Or go directly to: **http://localhost:8080/community**

### Step 4: Start Using!

1. **Register/Login:**
   - Click "Register" button (top right)
   - Create an account
   - Or click "Login" if you already have one

2. **View Posts:**
   - You'll see all community posts
   - If empty, create your first post!

3. **Create Post:**
   - Click "Share Your Story" button
   - Fill in the form
   - Submit!

## 🔍 Check If Everything Is Running

### Backend Check:
Open in browser: `http://localhost:5000/api/health`
- Should show: `{"success":true,"message":"Digital Fortress API is running"}`

### Frontend Check:
Open in browser: `http://localhost:8080`
- Should show: Digital Fortress homepage

## 🐛 Troubleshooting

### "Can't reach localhost:8080"
**Solution:** Frontend isn't running. Run:
```bash
npm run dev
```

### "Can't connect to backend"
**Solution:** Backend isn't running. In backend folder:
```bash
cd digital-fortress-backend
npm run dev
```

### Page is blank/errors
**Solution:** Check browser console (F12) for errors

## 📍 Quick URLs

- **Homepage:** http://localhost:8080
- **Community:** http://localhost:8080/community
- **Backend API:** http://localhost:5000/api
- **Backend Health:** http://localhost:5000/api/health

