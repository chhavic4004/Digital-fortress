# 🚀 Getting Started - Full System Testing Guide

## ✅ Current Status
- ✅ Backend server running on port 5000
- ✅ MongoDB connected
- ✅ Frontend code integrated
- ✅ Authentication system ready
- ✅ Post system ready

## Step-by-Step Testing Guide

### Step 1: Start Frontend (if not running)

Open a **new terminal window** (keep backend running):

```bash
npm run dev
```

Frontend should start on `http://localhost:5173`

### Step 2: Optional - Seed Sample Data

To see example posts, run this in the backend terminal:

```bash
cd digital-fortress-backend
npm run seed
```

This creates:
- 4 sample users (use email: `priya@example.com`, password: `password123`)
- 4 sample posts to view

### Step 3: Test the Complete Flow

#### 3.1 Register a New Account
1. Open `http://localhost:5173` in your browser
2. Click **"Register"** button in navigation
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Create Account"
5. You should be automatically logged in ✅

#### 3.2 View Community
1. Click **"Community"** in navigation
2. You should see the Community Storyboard page
3. If you seeded data, you'll see 4 sample posts
4. If not, you'll see an empty state (ready for your first post!)

#### 3.3 Create Your First Post
1. On Community page, click **"Share Your Story"**
2. Fill in the form:
   - **Title**: "Test Phishing Email Alert"
   - **Your Story**: "I received a suspicious email asking me to verify my bank account..."
   - **Scam Type**: Select "Phishing"
   - **Risk Level**: Select "High"
   - **Anonymous**: Toggle off (to see your name)
3. (Optional) Upload an image or screenshot
4. Click **"Share Story"**
5. Your post should appear in the list! ✅

#### 3.4 Test Like Feature
1. Click the 👍 (thumbs up) icon on any post
2. The like count should increase ✅

#### 3.5 Test Anonymous Posting
1. Click "Share Your Story" again
2. This time, toggle **"Post anonymously"** ON
3. Fill in the form and submit
4. The post should show **"Anonymous User"** as the author ✅

#### 3.6 Test Logout/Login
1. Click your username in navigation (top right)
2. Click **"Logout"**
3. Try to like a post - you should see "Login Required" message ✅
4. Click **"Login"**
5. Login with your credentials
6. You're back in! ✅

### Step 4: Verify Backend Integration

Check your backend terminal - you should see requests like:
```
POST /api/auth/register
POST /api/posts
GET /api/posts
POST /api/posts/:id/like
```

## 🎯 What to Verify

### ✅ Authentication
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Session persists (stays logged in after refresh)
- [ ] Can logout
- [ ] Login required for creating posts
- [ ] Login required for liking posts

### ✅ Posts
- [ ] Can view all posts
- [ ] Can create new post
- [ ] Can create anonymous post
- [ ] Posts show correct author (name or "Anonymous User")
- [ ] Posts display correctly (title, content, risk type, risk level)
- [ ] Media uploads work (if tested with images/videos)
- [ ] Posts appear immediately after creation

### ✅ Likes
- [ ] Can like posts (when logged in)
- [ ] Like count updates correctly
- [ ] Cannot like when not logged in (shows error)

### ✅ UI/UX
- [ ] Navigation shows login/register when logged out
- [ ] Navigation shows username when logged in
- [ ] Forms validate properly
- [ ] Error messages show correctly
- [ ] Success messages show correctly
- [ ] Loading states work (buttons show loading)
- [ ] Responsive on mobile

## 🔧 Troubleshooting

### Frontend can't connect to backend
**Solution:** 
- Check backend is running: `http://localhost:5000/api/health`
- Check `.env` file has `VITE_API_URL=http://localhost:5000/api` (optional)
- Check browser console for CORS errors

### Posts not showing
**Solution:**
- Check backend is running
- Check MongoDB is connected (check backend terminal)
- Try creating a new post
- Run seed script to add sample data

### Can't create post
**Solution:**
- Make sure you're logged in
- Check all required fields are filled
- Check browser console for errors
- Verify backend terminal shows the POST request

### Images not displaying
**Solution:**
- Check backend `uploads/` folder has the file
- Check browser console for 404 errors
- Verify media URL format: `http://localhost:5000/uploads/filename`

## 📝 Next Steps (Optional Features)

Once everything works, you can add:

1. **Comments UI** - Add a comments section to view/add comments
2. **Post Details Page** - Individual post view with full comment thread
3. **Search & Filter** - Filter posts by scam type or risk level
4. **User Profile** - View/edit user profile, see own posts
5. **Notifications** - Toast notifications for all actions
6. **Pagination** - Load posts in pages for better performance

## 🎉 Success!

If all the above works, your full-stack application is complete and ready to use!

**Your stack:**
- ✅ Frontend: React + TypeScript + Vite
- ✅ Backend: Node.js + Express
- ✅ Database: MongoDB Atlas
- ✅ Authentication: JWT
- ✅ File Upload: Multer
- ✅ Real-time Updates: React State Management

Ready to deploy or add more features! 🚀

