const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  // Multi-tenant
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Basic Details
  employee_id: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  official_email: {
    type: String,
    required: true,
    lowercase: true
  },
  personal_email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  alternate_phone: String,
  
  // Personal Details
  date_of_birth: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  marital_status: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed']
  },
  blood_group: String,
  
  // Address
  address: {
    current: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },
    permanent: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    }
  },
  
  // Job Details
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  designation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Designation'
  },
  reporting_manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  date_of_joining: {
    type: Date,
    required: true
  },
  employment_type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    default: 'Full-time'
  },
  work_location: String,
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  },
  
  // Role & Permissions
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'],
    default: 'EMPLOYEE'
  },
  permissions: [{
    module: String,
    access: {
      type: String,
      enum: ['READ', 'WRITE', 'DELETE', 'APPROVE']
    }
  }],
  
  // Salary Details
  salary_structure_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SalaryStructure'
  },
  current_salary: {
    basic: Number,
    hra: Number,
    allowances: Number,
    gross: Number,
    deductions: Number,
    net: Number
  },
  
  // Bank Details
  bank_details: {
    account_number: String,
    ifsc_code: String,
    bank_name: String,
    branch: String,
    account_holder_name: String
  },
  
  // KYC Documents
  documents: [{
    type: {
      type: String,
      enum: ['Aadhar', 'PAN', 'Passport', 'DrivingLicense', 'Resume', 'Photo', 'Other']
    },
    document_number: String,
    file_path: String,
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emergency Contact
  emergency_contact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  
  // Leave Balance
  leave_balance: [{
    leave_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType'
    },
    allocated: Number,
    used: Number,
    balance: Number,
    year: Number
  }],
  
  // Assets Assigned
  assets: [{
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    },
    assigned_date: Date,
    returned_date: Date,
    status: {
      type: String,
      enum: ['ASSIGNED', 'RETURNED', 'DAMAGED', 'LOST']
    }
  }],
  
  // Performance
  performance_ratings: [{
    year: Number,
    quarter: Number,
    rating: Number,
    comments: String,
    rated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    rated_at: Date
  }],
  
  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'TERMINATED', 'RESIGNED'],
    default: 'ACTIVE'
  },
  
  // Termination Details
  termination: {
    date: Date,
    reason: String,
    notice_period: Number,
    last_working_day: Date,
    exit_interview_completed: Boolean,
    assets_returned: Boolean
  },
  
  // Authentication
  password: {
    type: String,
    required: true,
    select: false
  },
  last_login: Date,
  
  // System Fields
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Compound indexes for multi-tenant queries
employeeSchema.index({ tenant_id: 1, employee_id: 1 }, { unique: true });
employeeSchema.index({ tenant_id: 1, official_email: 1 }, { unique: true });
employeeSchema.index({ tenant_id: 1, status: 1 });
employeeSchema.index({ tenant_id: 1, department_id: 1 });
employeeSchema.index({ tenant_id: 1, reporting_manager: 1 });

// Virtual for full name
employeeSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('Employee', employeeSchema);