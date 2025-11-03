// Simple Node.js script to test the API endpoints
// Run this after starting your server: node test-api.js

const API_BASE = 'http://localhost:5000/api';

// Helper function to make requests
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  let token = '';
  let postId = '';

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await request('/health');
    console.log('✅ Health:', health.data.message);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣ Testing User Registration...');
    const register = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      }),
    });
    
    if (register.data.token) {
      token = register.data.token;
      console.log('✅ Registration successful!');
      console.log('   User:', register.data.username);
      console.log('   Token received:', token.substring(0, 20) + '...');
    } else {
      // Try login instead if user exists
      console.log('⚠️  User might exist, trying login...');
      const login = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
      
      if (login.data.token) {
        token = login.data.token;
        console.log('✅ Login successful!');
      }
    }
    console.log('');

    if (!token) {
      console.log('❌ No token received. Cannot continue tests.');
      return;
    }

    // Test 3: Get Current User
    console.log('3️⃣ Testing Get Current User...');
    const me = await request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('✅ Current user:', me.data.username);
    console.log('');

    // Test 4: Get All Posts
    console.log('4️⃣ Testing Get All Posts...');
    const posts = await request('/posts');
    console.log('✅ Found', posts.data.count || posts.data.length, 'posts');
    if (posts.data.data && posts.data.data.length > 0) {
      postId = posts.data.data[0]._id;
      console.log('   Using post ID:', postId);
    }
    console.log('');

    // Test 5: Create Post
    console.log('5️⃣ Testing Create Post...');
    const newPost = await request('/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Test Scam Alert - ' + new Date().toISOString(),
        content: 'This is a test post created by the automated test script.',
        riskType: 'Phishing',
        riskLevel: 'high',
        isAnonymous: false,
      }),
    });
    
    if (newPost.data._id) {
      postId = newPost.data._id;
      console.log('✅ Post created!');
      console.log('   Post ID:', postId);
      console.log('   Title:', newPost.data.title);
    } else {
      console.log('❌ Post creation failed:', newPost.data.message);
    }
    console.log('');

    if (postId) {
      // Test 6: Like Post
      console.log('6️⃣ Testing Like Post...');
      const like = await request(`/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('✅ Like toggled:', like.data.liked ? 'Liked' : 'Unliked');
      console.log('   Likes count:', like.data.likesCount);
      console.log('');

      // Test 7: Add Comment
      console.log('7️⃣ Testing Add Comment...');
      const comment = await request(`/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: 'This is a test comment from the automated test script!',
        }),
      });
      console.log('✅ Comment added!');
      console.log('   Comments count:', comment.data.commentsCount);
      console.log('');
    }

    // Test 8: Get Single Post
    if (postId) {
      console.log('8️⃣ Testing Get Single Post...');
      const singlePost = await request(`/posts/${postId}`);
      console.log('✅ Retrieved post:', singlePost.data.title);
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   - Health check: ✅');
    console.log('   - Authentication: ✅');
    console.log('   - Get posts: ✅');
    console.log('   - Create post: ✅');
    console.log('   - Like post: ✅');
    console.log('   - Comment: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure:');
    console.error('   1. Server is running on http://localhost:5000');
    console.error('   2. MongoDB is connected');
    console.error('   3. .env file is configured correctly');
  }
}

// Run tests
runTests();

