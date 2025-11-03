import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, upload.single('media'), async (req, res) => {
  try {
    const { title, content, riskType, riskLevel, isAnonymous } = req.body;

    // Validation
    if (!title || !content || !riskType || !riskLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, riskType, and riskLevel',
      });
    }

    // Determine media type if file was uploaded
    let mediaUrl = null;
    let mediaType = null;
    
    if (req.file) {
      // In production, you might want to use Cloudinary here
      // For now, we'll use a relative URL
      mediaUrl = `/uploads/${req.file.filename}`;
      
      // Determine if it's image or video
      if (req.file.mimetype.startsWith('image/')) {
        mediaType = 'image';
      } else if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      }
    }

    // Create post
    const post = await Post.create({
      title,
      content,
      riskType,
      riskLevel,
      media: mediaUrl,
      mediaType,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      userId: req.user._id,
      likes: [],
      comments: [],
    });

    // Populate user info for response
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username email')
      .exec();

    // Format response based on isAnonymous
    const responsePost = {
      ...populatedPost.toObject(),
      author: populatedPost.isAnonymous
        ? 'Anonymous User'
        : populatedPost.userId.username,
      authorId: populatedPost.isAnonymous ? null : populatedPost.userId._id,
    };

    // Don't expose user object if anonymous
    if (populatedPost.isAnonymous) {
      delete responsePost.userId;
    }

    res.status(201).json({
      success: true,
      data: responsePost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .exec();

    // Format posts to handle anonymous users
    const formattedPosts = posts.map((post) => {
      const postObj = post.toObject();
      return {
        ...postObj,
        author: postObj.isAnonymous ? 'Anonymous User' : postObj.userId.username,
        authorId: postObj.isAnonymous ? null : postObj.userId._id,
        likesCount: postObj.likes.length,
        commentsCount: postObj.comments.length,
        // Hide userId if anonymous
        userId: postObj.isAnonymous ? undefined : postObj.userId,
      };
    });

    res.json({
      success: true,
      count: formattedPosts.length,
      data: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username email')
      .exec();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const postObj = post.toObject();
    const formattedPost = {
      ...postObj,
      author: postObj.isAnonymous ? 'Anonymous User' : postObj.userId.username,
      authorId: postObj.isAnonymous ? null : postObj.userId._id,
      likesCount: postObj.likes.length,
      commentsCount: postObj.comments.length,
      userId: postObj.isAnonymous ? undefined : postObj.userId,
    };

    res.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userId = req.user._id.toString();
    const likesArray = post.likes.map((id) => id.toString());

    // Toggle like
    if (likesArray.includes(userId)) {
      // Unlike
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
      await post.save();

      res.json({
        success: true,
        message: 'Post unliked',
        data: {
          liked: false,
          likesCount: post.likes.length,
        },
      });
    } else {
      // Like
      post.likes.push(req.user._id);
      await post.save();

      res.json({
        success: true,
        message: 'Post liked',
        data: {
          liked: true,
          likesCount: post.likes.length,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add comment to a post
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a comment message',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Get user info for comment
    const user = await User.findById(req.user._id);

    // Add comment
    const comment = {
      commenterId: req.user._id,
      commenterName: user.username,
      message: message.trim(),
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: {
        comment,
        commentsCount: post.comments.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

