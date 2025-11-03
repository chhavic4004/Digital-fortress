# Fix: Port 5000 Already in Use

## Quick Fix Options

### Option 1: Kill the Existing Process (Recommended)
The process using port 5000 is likely your backend server from a previous run.

**Windows PowerShell:**
```powershell
taskkill /PID 24916 /F
```

Then restart your server:
```powershell
cd digital-fortress-backend
npm run dev
```

### Option 2: Use a Different Port

1. Edit `.env` file in `digital-fortress-backend`:
   ```
   PORT=5001
   ```

2. Restart server - it will use port 5001

3. Update frontend `.env` (if you have one):
   ```
   VITE_API_URL=http://localhost:5001/api
   ```

### Option 3: Find What's Running on Port 5000

To see what process is using port 5000:
```powershell
netstat -ano | findstr :5000
```

Then check the process:
```powershell
tasklist | findstr 24916
```

## Why This Happens

- Previous server instance didn't close properly
- Another application is using port 5000
- Multiple terminal windows running the server

## Prevention

Always use `Ctrl+C` to properly stop the server before closing the terminal.

