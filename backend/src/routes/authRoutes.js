// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  getProfile,
  logout
} = require('../controllers/authController');

// Validation rules for registration
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['parent', 'therapist']).withMessage('Role must be parent or therapist'),
  body('childName').notEmpty().withMessage('Child name is required'),
  body('childAge').optional().isInt({ min: 2, max: 18 }).withMessage('Child age must be between 2 and 18'),
  body('parentName').if(body('role').equals('parent')).notEmpty().withMessage('Parent name is required for parent accounts'),
  body('parentPhone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('therapistId').optional()
];

// Validation rules for login
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

module.exports = router;