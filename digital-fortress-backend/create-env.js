// Helper script to create .env file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envTemplate = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# Replace with your MongoDB connection string
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/digital-fortress?retryWrites=true&w=majority
# For Local MongoDB: mongodb://localhost:27017/digital-fortress
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING_HERE

# JWT Configuration
# Generate a secret key (min 32 characters)
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters-long
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  console.log('If you want to recreate it, delete the existing .env file first.');
  process.exit(0);
}

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Open the .env file');
  console.log('2. Replace YOUR_MONGODB_CONNECTION_STRING_HERE with your actual MongoDB URI');
  console.log('3. Generate a secure JWT_SECRET (optional, but recommended)');
  console.log('\n💡 MongoDB Atlas Setup:');
  console.log('   - Go to https://www.mongodb.com/cloud/atlas');
  console.log('   - Create a free cluster');
  console.log('   - Create a database user');
  console.log('   - Whitelist your IP (0.0.0.0/0 for development)');
  console.log('   - Copy connection string');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  process.exit(1);
}

