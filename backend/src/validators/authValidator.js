const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('company_name')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
    
  body('company_email')
    .isEmail()
    .withMessage('Please provide a valid company email')
    .normalizeEmail(),
    
  body('company_phone')
    .notEmpty()
    .withMessage('Company phone is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('admin_name')
    .notEmpty()
    .withMessage('Admin name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Admin name must be between 2 and 50 characters'),
    
  body('admin_email')
    .isEmail()
    .withMessage('Please provide a valid admin email')
    .normalizeEmail(),
    
  body('admin_phone')
    .notEmpty()
    .withMessage('Admin phone is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('plan')
    .optional()
    .isIn(['BASIC', 'MEDIUM', 'GOLD'])
    .withMessage('Invalid plan selected'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin
};