const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id)
        .populate('tenant_id')
        .select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if company is active
      if (req.user.tenant_id && req.user.tenant_id.status !== 'ACTIVE') {
        return res.status(403).json({ 
          message: 'Company account is not active',
          company_status: req.user.tenant_id.status
        });
      }

      // Check subscription status
      if (req.user.tenant_id && req.user.tenant_id.subscription.status !== 'ACTIVE') {
        return res.status(403).json({ 
          message: 'Subscription expired or inactive',
          subscription_status: req.user.tenant_id.subscription.status
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role ${req.user.role} is not authorized to access this resource` 
      });
    }

    next();
  };
};

// Super Admin only
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
};

// Company Admin or HR Manager
const adminOrHR = (req, res, next) => {
  if (req.user && ['COMPANY_ADMIN', 'HR_MANAGER'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin or HR only.' });
  }
};

// Manager level access (includes Team Lead)
const managerAccess = (req, res, next) => {
  if (req.user && ['COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD'].includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Manager level access required.' });
  }
};

// Check feature access based on subscription plan
const checkFeatureAccess = (feature) => {
  return (req, res, next) => {
    if (!req.user || !req.user.tenant_id) {
      return res.status(403).json({ message: 'Company information not found' });
    }

    const company = req.user.tenant_id;
    
    // Super admin has access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Check if feature is enabled for the company
    if (!company.features[feature]) {
      return res.status(403).json({ 
        message: `Feature '${feature}' is not available in your current plan`,
        current_plan: company.subscription.plan,
        required_upgrade: getRequiredPlan(feature)
      });
    }

    next();
  };
};

// Get required plan for a feature
const getRequiredPlan = (feature) => {
  const featurePlans = {
    payroll: 'MEDIUM',
    performance: 'MEDIUM',
    geo_attendance: 'GOLD',
    face_attendance: 'GOLD',
    multi_approval: 'GOLD',
    workflows: 'GOLD',
    integrations: 'GOLD',
    white_labeling: 'GOLD',
    ip_restriction: 'GOLD'
  };

  return featurePlans[feature] || 'BASIC';
};

// Check employee limit
const checkEmployeeLimit = async (req, res, next) => {
  try {
    if (!req.user || !req.user.tenant_id) {
      return res.status(403).json({ message: 'Company information not found' });
    }

    const company = req.user.tenant_id;
    
    // Super admin has no limits
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Count current users
    const currentEmployeeCount = await User.countDocuments({
      tenant_id: company._id,
      status: 'ACTIVE'
    });

    if (currentEmployeeCount >= company.limits.employees) {
      return res.status(403).json({
        message: 'Employee limit reached for your current plan',
        current_count: currentEmployeeCount,
        limit: company.limits.employees,
        plan: company.subscription.plan
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking employee limit' });
  }
};

module.exports = {
  protect,
  authorize,
  superAdminOnly,
  adminOrHR,
  managerAccess,
  checkFeatureAccess,
  checkEmployeeLimit
};