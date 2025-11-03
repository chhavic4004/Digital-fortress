# Testing Guide for Digital Fortress Backend

## Quick Test Checklist

Follow these steps to verify your backend is working correctly:

## Step 1: Install Dependencies

```bash
cd digital-fortress-backend
npm install
```

## Step 2: Create .env File

Create a `.env` file in the `digital-fortress-backend` directory:

**For Testing with Local MongoDB:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/digital-fortress
JWT_SECRET=test-secret-key-for-development-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

**For Testing with MongoDB Atlas (Cloud):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-fortress?retryWrites=true&w=majority
JWT_SECRET=test-secret-key-for-development-min-32-characters-long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## Step 3: Start the Server

Open a terminal and run:

```bash
npm run dev
```

You should see:
```
MongoDB Connected: ...
Server running in development mode on port 5000
```

If you see this, your server is running! ✅

## Step 4: Test the API

### Method 1: Using curl (Command Line)

Open a **new terminal window** (keep the server running in the first one).

#### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"success":true,"message":"Digital Fortress API is running","timestamp":"..."}
```

#### Test 2: Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

*(Note: Use `\` instead of `^` on Mac/Linux)*

Expected response:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "token": "..."
  }
}
```

**Save the token** from the response!

#### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

#### Test 4: Get Current User (Protected Route)
```bash
curl http://localhost:5000/api/auth/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from registration/login.

#### Test 5: Get All Posts
```bash
curl http://localhost:5000/api/posts
```

#### Test 6: Create a Post
```bash
curl -X POST http://localhost:5000/api/posts ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Test Scam Alert\",\"content\":\"This is a test post about a phishing scam.\",\"riskType\":\"Phishing\",\"riskLevel\":\"high\",\"isAnonymous\":false}"
```

#### Test 7: Create Anonymous Post
```bash
curl -X POST http://localhost:5000/api/posts ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Anonymous Scam Alert\",\"content\":\"This is an anonymous test post.\",\"riskType\":\"UPI Scam\",\"riskLevel\":\"medium\",\"isAnonymous\":true}"
```

#### Test 8: Like a Post
First, get a post ID from the "Get All Posts" response, then:
```bash
curl -X POST http://localhost:5000/api/posts/POST_ID_HERE/like ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test 9: Add Comment
```bash
curl -X POST http://localhost:5000/api/posts/POST_ID_HERE/comment ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Great information, thanks for sharing!\"}"
```

### Method 2: Using Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import"
   - Select `DIGITAL_FORTRESS_API.postman_collection.json` from the backend folder

2. **Set Base URL:**
   - In Postman, click on the collection name
   - Go to "Variables" tab
   - Set `base_url` to `http://localhost:5000`

3. **Test Flow:**
   - Start with **"Register User"** or **"Login"**
   - The token will be automatically saved after login
   - Then try other endpoints like "Get All Posts", "Create Post", etc.

### Method 3: Using Browser

You can test GET endpoints directly in your browser:

- Health Check: `http://localhost:5000/api/health`
- Get Posts: `http://localhost:5000/api/posts`
- Root: `http://localhost:5000/`

## Step 5: Seed Database (Optional)

To populate with sample data:

```bash
npm run seed
```

This creates 4 users and 4 posts. You can then:
- Login with any user (email: `priya@example.com`, password: `password123`)
- View the seeded posts

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` in the backend directory

### Issue: "MongoDB connection error"
**Solution:** 
- Check your `.env` file has correct `MONGO_URI`
- If using MongoDB Atlas, ensure your IP is whitelisted
- Check internet connection

### Issue: "Port 5000 already in use"
**Solution:**
- Change `PORT` in `.env` to another number (e.g., `5001`)
- Or kill the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:5000 | xargs kill
  ```

### Issue: "Unauthorized" error
**Solution:**
- Make sure you're including the Bearer token in Authorization header
- Token format: `Authorization: Bearer YOUR_TOKEN_HERE`
- Token might have expired, try logging in again

### Issue: "Validation error"
**Solution:**
- Check that all required fields are provided
- Ensure `riskType` is one of: "UPI Scam", "Phishing", "OTP Fraud", etc.
- Ensure `riskLevel` is one of: "low", "medium", "high"

## Expected API Responses

### Success Response Format:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing Checklist

- [ ] Server starts without errors
- [ ] Health check endpoint works
- [ ] User registration works
- [ ] User login works
- [ ] Get current user works (with token)
- [ ] Get all posts works
- [ ] Create post works (with token)
- [ ] Create anonymous post works
- [ ] Like post works
- [ ] Add comment works
- [ ] Files upload successfully (if testing with images/videos)
- [ ] Error handling works (test with invalid data)

## Next Steps

Once backend is tested and working:
1. Connect your frontend to the API
2. Update frontend API calls to use `http://localhost:5000/api/...`
3. Deploy to Render when ready

