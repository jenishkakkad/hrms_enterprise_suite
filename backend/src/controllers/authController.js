const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Company = require('../models/Company');
const { sendEmail } = require('../services/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Register new company and admin user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const {
      // Company details
      company_name,
      company_email,
      company_phone,
      industry,
      company_size,
      
      // Admin details
      admin_name,
      admin_email,
      admin_phone,
      password,
      
      // Plan selection
      plan = 'BASIC'
    } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email: company_email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already registered with this email' });
    }

    // Check if admin email already exists
    const existingAdmin = await Employee.findOne({ official_email: admin_email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin email already exists' });
    }

    // Create company
    const company = await Company.create({
      name: company_name,
      email: company_email,
      phone: company_phone,
      industry,
      company_size,
      admin: {
        name: admin_name,
        email: admin_email,
        phone: admin_phone
      },
      subscription: {
        plan,
        status: 'TRIAL',
        start_date: new Date(),
        trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      // Set plan-based limits and features
      ...getPlanConfiguration(plan)
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin employee
    const adminEmployee = await Employee.create({
      tenant_id: company._id,
      employee_id: 'EMP001',
      first_name: admin_name.split(' ')[0],
      last_name: admin_name.split(' ').slice(1).join(' ') || '',
      official_email: admin_email,
      phone: admin_phone,
      role: 'COMPANY_ADMIN',
      date_of_joining: new Date(),
      status: 'ACTIVE',
      password: hashedPassword
    });

    // Generate tokens
    const token = generateToken(adminEmployee._id);
    const refreshToken = generateRefreshToken(adminEmployee._id);

    // Send welcome email
    await sendEmail({
      to: admin_email,
      subject: 'Welcome to HRMS SaaS Platform',
      template: 'welcome',
      data: {
        company_name,
        admin_name,
        trial_days: 14,
        login_url: `${process.env.FRONTEND_URL}/login`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        company: {
          id: company._id,
          name: company.name,
          plan: company.subscription.plan,
          trial_end: company.subscription.trial_end_date
        },
        user: {
          id: adminEmployee._id,
          name: `${adminEmployee.first_name} ${adminEmployee.last_name}`,
          email: adminEmployee.official_email,
          role: adminEmployee.role
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email })
      .populate('tenant_id')
      .select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return res.status(401).json({ message: 'Account is not active' });
    }

    // Check company status (skip for super admin)
    if (user.role !== 'SUPER_ADMIN' && user.tenant_id && user.tenant_id.status !== 'ACTIVE') {
      return res.status(401).json({ 
        message: 'Company account is not active',
        company_status: user.tenant_id.status
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    user.last_login = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employee_id: user.employee_id
        },
        company: user.tenant_id ? {
          id: user.tenant_id._id,
          name: user.tenant_id.name,
          plan: user.tenant_id.subscription?.plan,
          subscription_status: user.tenant_id.subscription?.status
        } : null,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).populate('tenant_id');
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      data: {
        token: newToken
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('tenant_id')
      .select('-password');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to get plan configuration
const getPlanConfiguration = (plan) => {
  const configs = {
    BASIC: {
      limits: {
        employees: 30,
        hr_users: 1,
        storage_gb: 1,
        managers: 1
      },
      features: {
        payroll: false,
        performance: false,
        geo_attendance: false,
        face_attendance: false,
        multi_approval: false,
        workflows: false,
        integrations: false,
        white_labeling: false,
        ip_restriction: false
      }
    },
    MEDIUM: {
      limits: {
        employees: 150,
        hr_users: 3,
        storage_gb: 10,
        managers: 10
      },
      features: {
        payroll: true,
        performance: true,
        geo_attendance: false,
        face_attendance: false,
        multi_approval: false,
        workflows: false,
        integrations: false,
        white_labeling: false,
        ip_restriction: false
      }
    },
    GOLD: {
      limits: {
        employees: -1, // Unlimited
        hr_users: -1,
        storage_gb: -1,
        managers: -1
      },
      features: {
        payroll: true,
        performance: true,
        geo_attendance: true,
        face_attendance: true,
        multi_approval: true,
        workflows: true,
        integrations: true,
        white_labeling: true,
        ip_restriction: true
      }
    }
  };

  return configs[plan] || configs.BASIC;
};

// Placeholder functions for other auth operations
const forgotPassword = async (req, res) => {
  res.json({ message: 'Forgot password functionality to be implemented' });
};

const resetPassword = async (req, res) => {
  res.json({ message: 'Reset password functionality to be implemented' });
};

const changePassword = async (req, res) => {
  res.json({ message: 'Change password functionality to be implemented' });
};

const updateProfile = async (req, res) => {
  res.json({ message: 'Update profile functionality to be implemented' });
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};