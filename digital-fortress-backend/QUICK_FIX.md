# Quick Fix for "MONGO_URI is undefined" Error

## The Problem
The error `The uri parameter to openUri() must be a string, got "undefined"` means your `.env` file is missing or doesn't have `MONGO_URI`.

## Solution

### Step 1: Create .env File

In the `digital-fortress-backend` folder, create a file named `.env` with this content:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/digital-fortress
JWT_SECRET=test-secret-key-for-development-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Step 2: Get MongoDB Connection String

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `digital-fortress`
8. Example:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digital-fortress?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB**

If you have MongoDB installed locally:
```
MONGO_URI=mongodb://localhost:27017/digital-fortress
```

If you don't have MongoDB installed, use Option A (Atlas).

### Step 3: Restart Server

After creating/updating `.env`, restart your server:
- Stop the current server (Ctrl+C)
- Run `npm run dev` again

## Quick Setup Commands

### Windows PowerShell:
```powershell
cd digital-fortress-backend
New-Item -ItemType File -Path .env -Force
```

Then edit `.env` file and paste the content above (with your MongoDB URI).

### Or use the setup script:
```bash
npm run setup-env
```

This will create a `.env` file template. Then edit it with your MongoDB URI.

## Verify .env is Loading

After creating `.env`, start the server. You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

If you still see the error, make sure:
1. `.env` file is in `digital-fortress-backend` folder (same folder as `server.js`)
2. No spaces around the `=` sign in `.env`
3. No quotes around values (unless needed)
4. Restart the server after creating/updating `.env`

## Need Help?

- MongoDB Atlas Setup: https://www.mongodb.com/docs/atlas/getting-started/
- Local MongoDB: https://www.mongodb.com/docs/manual/installation/

