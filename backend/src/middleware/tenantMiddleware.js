const Company = require('../models/Company');

// Multi-tenant middleware to ensure data isolation
const tenantMiddleware = async (req, res, next) => {
  try {
    // Skip for super admin
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Ensure user has tenant_id
    if (!req.user || !req.user.tenant_id) {
      return res.status(403).json({ 
        message: 'Tenant information not found. Please contact administrator.' 
      });
    }

    // Add tenant_id to request for use in controllers
    req.tenant_id = req.user.tenant_id._id || req.user.tenant_id;

    // Verify tenant is active
    const company = await Company.findById(req.tenant_id);
    if (!company || company.status !== 'ACTIVE') {
      return res.status(403).json({ 
        message: 'Company account is not active',
        status: company ? company.status : 'NOT_FOUND'
      });
    }

    // Check subscription status
    if (company.subscription.status !== 'ACTIVE' && company.subscription.status !== 'TRIAL') {
      return res.status(403).json({ 
        message: 'Subscription expired. Please renew to continue.',
        subscription_status: company.subscription.status,
        end_date: company.subscription.end_date
      });
    }

    // Add company info to request
    req.company = company;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ message: 'Internal server error in tenant validation' });
  }
};

// Middleware to add tenant filter to queries
const addTenantFilter = (req, res, next) => {
  // Skip for super admin
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Add tenant filter to query
  if (req.tenant_id) {
    req.query.tenant_id = req.tenant_id;
  }

  next();
};

// Middleware to validate tenant ownership of resources
const validateTenantOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      
      // Skip for super admin
      if (req.user && req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      if (!resourceId) {
        return res.status(400).json({ message: 'Resource ID is required' });
      }

      // Check if resource belongs to the tenant
      const resource = await Model.findOne({
        _id: resourceId,
        tenant_id: req.tenant_id
      });

      if (!resource) {
        return res.status(404).json({ 
          message: 'Resource not found or access denied' 
        });
      }

      // Add resource to request for use in controller
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Tenant ownership validation error:', error);
      res.status(500).json({ message: 'Error validating resource ownership' });
    }
  };
};

module.exports = {
  tenantMiddleware,
  addTenantFilter,
  validateTenantOwnership
};