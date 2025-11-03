# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create .env File

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-fortress?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://digital-fortress-q6jn.vercel.app
```

### Getting MongoDB URI:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get your connection string and replace `<password>` with your actual password

### Generating JWT Secret:

Use a long random string (minimum 32 characters). You can generate one using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Create Uploads Directory

```bash
mkdir uploads
```

Or the directory should already exist with a `.gitkeep` file.

## Step 4: Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## Step 5: Seed Database (Optional)

To populate the database with sample data:

```bash
npm run seed
```

This creates:
- 4 sample users (password: `password123`)
- 4 sample posts (mix of anonymous and public)

## Testing the API

### Using curl:

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Save the token from the response, then use it:

**Get Posts:**
```bash
curl http://localhost:5000/api/posts
```

**Create Post:**
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post",
    "riskType": "Phishing",
    "riskLevel": "high",
    "isAnonymous": false
  }'
```

### Using Postman:

1. Import `DIGITAL_FORTRESS_API.postman_collection.json` into Postman
2. Update the `base_url` variable if needed
3. Start with "Register User" or "Login"
4. The token will be automatically saved after login
5. Use other endpoints to test the API

## Common Issues

### MongoDB Connection Error
- Check your MONGO_URI in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### Port Already in Use
- Change PORT in `.env`
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

### File Upload Not Working
- Ensure `uploads/` directory exists
- Check file size (max 50MB)
- Verify file type (images/videos only)

## Production Deployment (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Create new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

For production, consider:
- Using Cloudinary for file storage instead of local files
- Setting up proper logging
- Using environment-specific configurations
- Setting up monitoring and alerts

