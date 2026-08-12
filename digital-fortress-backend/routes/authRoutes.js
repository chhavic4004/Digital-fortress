import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT Token
import { generateToken } from "../utils/generateToken.js";
import { readLocalUsers, writeLocalUsers } from "../utils/localAuthStore.js";

const useLocalAuth = () => mongoose.connection.readyState !== 1;


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    if (useLocalAuth()) {
      const users = await readLocalUsers();
      const userExists = users.find((user) => user.email === email || user.username === username);

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username',
        });
      }

      const fallbackUser = {
        _id: `local-${Date.now()}`,
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(fallbackUser);
      await writeLocalUsers(users);

      return res.status(201).json({
        success: true,
        data: {
          _id: fallbackUser._id,
          username: fallbackUser.username,
          email: fallbackUser.email,
          createdAt: fallbackUser.createdAt,
          token: generateToken(fallbackUser._id),
        },
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username',
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (useLocalAuth()) {
      const users = await readLocalUsers();
      const user = users.find((entry) => entry.email === email);

      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          token: generateToken(user._id),
        },
      });
    }

    // Check for user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbackSecretKey');

    if (useLocalAuth()) {
      const users = await readLocalUsers();
      const user = users.find((entry) => entry._id === String(decoded.id));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    }

    const user = await User.findById(decoded.id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
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

