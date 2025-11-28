const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  logo: String,
  website: String,
  industry: String,
  company_size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  
  // Subscription Details
  subscription: {
    plan: {
      type: String,
      enum: ['BASIC', 'MEDIUM', 'GOLD'],
      default: 'BASIC'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TRIAL'],
      default: 'TRIAL'
    },
    start_date: Date,
    end_date: Date,
    trial_end_date: Date,
    auto_renewal: {
      type: Boolean,
      default: true
    }
  },
  
  // Plan Limits
  limits: {
    employees: {
      type: Number,
      default: 30
    },
    hr_users: {
      type: Number,
      default: 1
    },
    storage_gb: {
      type: Number,
      default: 1
    },
    managers: {
      type: Number,
      default: 1
    }
  },
  
  // Features Access
  features: {
    payroll: {
      type: Boolean,
      default: false
    },
    performance: {
      type: Boolean,
      default: false
    },
    geo_attendance: {
      type: Boolean,
      default: false
    },
    face_attendance: {
      type: Boolean,
      default: false
    },
    multi_approval: {
      type: Boolean,
      default: false
    },
    workflows: {
      type: Boolean,
      default: false
    },
    integrations: {
      type: Boolean,
      default: false
    },
    white_labeling: {
      type: Boolean,
      default: false
    },
    ip_restriction: {
      type: Boolean,
      default: false
    }
  },
  
  // Settings
  settings: {
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    date_format: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    week_start: {
      type: String,
      enum: ['Monday', 'Sunday'],
      default: 'Monday'
    },
    working_days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    grace_period_minutes: {
      type: Number,
      default: 15
    }
  },
  
  // Admin Details
  admin: {
    name: String,
    email: String,
    phone: String
  },
  
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'PENDING'
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ email: 1 });
companySchema.index({ 'subscription.status': 1 });
companySchema.index({ status: 1 });

module.exports = mongoose.model('Company', companySchema);