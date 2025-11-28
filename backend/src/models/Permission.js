const mongoose = require('mongoose');

// Permission Schema
const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  module: {
    type: String,
    required: true,
    enum: ['EMPLOYEE', 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'PERFORMANCE', 'TASK', 'ADMIN', 'REPORTS']
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT', 'IMPORT']
  },
  description: String,
  is_system: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Role Schema with Dynamic Permissions
const roleSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }, // null for system roles
  
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: String,
  
  // Dynamic Permissions
  permissions: [{
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    },
    granted: {
      type: Boolean,
      default: true
    },
    conditions: {
      own_data_only: Boolean,
      department_only: Boolean,
      reporting_hierarchy: Boolean
    }
  }],
  
  // Role Hierarchy
  level: {
    type: Number,
    default: 1
  },
  parent_role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  
  is_system: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Company Policy Schema
const policySchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['LEAVE', 'ATTENDANCE', 'PAYROLL', 'PERFORMANCE', 'GENERAL']
  },
  
  rules: [{
    condition: String,
    action: String,
    value: mongoose.Schema.Types.Mixed,
    is_active: {
      type: Boolean,
      default: true
    }
  }],
  
  applies_to: {
    roles: [String],
    departments: [String],
    employees: [mongoose.Schema.Types.ObjectId]
  },
  
  effective_from: {
    type: Date,
    default: Date.now
  },
  effective_to: Date,
  
  is_active: {
    type: Boolean,
    default: true
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Indexes
permissionSchema.index({ module: 1, action: 1 });
roleSchema.index({ tenant_id: 1, code: 1 });
policySchema.index({ tenant_id: 1, type: 1, is_active: 1 });

const Permission = mongoose.model('Permission', permissionSchema);
const Role = mongoose.model('Role', roleSchema);
const Policy = mongoose.model('Policy', policySchema);

module.exports = {
  Permission,
  Role,
  Policy
};