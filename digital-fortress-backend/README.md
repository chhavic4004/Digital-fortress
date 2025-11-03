# Digital Fortress Backend API

Backend API for the Digital Fortress Community Platform - a cybersecurity community where users can share scam experiences, learn about threats, and stay protected.

## Features

- ✅ User authentication (JWT-based)
- ✅ Post management (create, view, list)
- ✅ Anonymous posting support
- ✅ File uploads (images/videos)
- ✅ Like and comment system
- ✅ Rate limiting
- ✅ Security middleware (Helmet, CORS)
- ✅ Error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Express Rate Limit** - Rate limiting

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd digital-fortress-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRE=7d
FRONTEND_URL=https://digital-fortress-q6jn.vercel.app
```

5. Create the uploads directory:
```bash
mkdir uploads
```

6. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (Protected)
- `POST /api/posts/:id/like` - Toggle like (Protected)
- `POST /api/posts/:id/comment` - Add comment (Protected)

### Health Check

- `GET /api/health` - Check API status

## API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Phishing Email Alert",
    "content": "Received a suspicious email asking for credentials...",
    "riskType": "Phishing",
    "riskLevel": "high",
    "isAnonymous": false
  }'
```

### Upload Post with Media
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Scam Screenshot" \
  -F "content=This is a screenshot of a scam message" \
  -F "riskType=UPI Scam" \
  -F "riskLevel=high" \
  -F "isAnonymous=false" \
  -F "media=@/path/to/image.jpg"
```

### Get All Posts
```bash
curl http://localhost:5000/api/posts
```

### Like a Post
```bash
curl -X POST http://localhost:5000/api/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add Comment
```bash
curl -X POST http://localhost:5000/api/posts/POST_ID/comment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "This is helpful, thanks for sharing!"
  }'
```

## Seed Data

To populate the database with sample data:

```bash
npm run seed
```

This will create:
- 4 sample users (passwords: `password123`)
- 4 sample posts (mix of anonymous and public)

## Project Structure

```
digital-fortress-backend/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── config/
│   └── db.js             # Database connection
├── models/
│   ├── User.js           # User model
│   └── Post.js           # Post model
├── middleware/
│   ├── authMiddleware.js # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   └── upload.js         # File upload configuration
├── routes/
│   ├── authRoutes.js     # Authentication routes
│   └── postRoutes.js     # Post routes
├── utils/
│   └── seed.js           # Seed data script
└── uploads/              # Uploaded files directory
```

## Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables in Render dashboard:
   - `PORT` (auto-set by Render)
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRE` | JWT expiration time | No (default: 7d) |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `NODE_ENV` | Environment mode | No |

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Helmet for HTTP headers security
- CORS configuration
- Rate limiting
- Input validation
- Error handling

## License

ISC

## Support

For issues or questions, please open an issue on GitHub.

