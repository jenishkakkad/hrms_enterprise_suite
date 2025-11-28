const mongoose = require('mongoose');

// Leave Types Schema
const leaveTypeSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }, // null for global leave types
  
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: String,
  
  // Allocation Rules
  annual_allocation: Number,
  max_consecutive_days: Number,
  min_days_notice: Number,
  max_carry_forward: Number,
  
  // Flags
  is_paid: {
    type: Boolean,
    default: true
  },
  requires_approval: {
    type: Boolean,
    default: true
  },
  is_encashable: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  
  // Gender Specific
  applicable_gender: {
    type: String,
    enum: ['All', 'Male', 'Female'],
    default: 'All'
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Leave Application Schema
const leaveSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leave_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: true
  },
  
  // Leave Details
  from_date: {
    type: Date,
    required: true
  },
  to_date: {
    type: Date,
    required: true
  },
  total_days: {
    type: Number,
    required: true
  },
  is_half_day: {
    type: Boolean,
    default: false
  },
  half_day_session: {
    type: String,
    enum: ['FIRST_HALF', 'SECOND_HALF']
  },
  
  // Application Details
  reason: {
    type: String,
    required: true
  },
  contact_number: String,
  address_during_leave: String,
  
  // Workflow Status
  status: {
    type: String,
    enum: ['PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  },
  
  // Multi-level Approval Workflow
  workflow: {
    current_level: {
      type: Number,
      default: 1
    },
    total_levels: {
      type: Number,
      default: 2 // Manager + HR
    },
    approvers: [{
      level: Number,
      approver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
      },
      approver_role: {
        type: String,
        enum: ['MANAGER', 'HR_MANAGER', 'COMPANY_ADMIN']
      },
      status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
      },
      comments: String,
      action_date: Date,
      is_required: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  // Final Status
  final_approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  final_approved_at: Date,
  rejection_reason: String,
  rejected_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  rejected_at: Date,
  
  // Cancellation
  cancelled_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  cancelled_at: Date,
  cancellation_reason: String,
  
  // Attachments
  attachments: [{
    file_name: String,
    file_path: String,
    file_size: Number,
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Notifications
  notifications_sent: [{
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    type: {
      type: String,
      enum: ['APPLIED', 'APPROVED', 'REJECTED', 'CANCELLED', 'REMINDER']
    },
    sent_at: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['SENT', 'FAILED'],
      default: 'SENT'
    }
  }],
  
  // Leave Balance Impact
  balance_deducted: {
    type: Boolean,
    default: false
  },
  balance_deduction_date: Date,
  
  // Calendar Integration
  calendar_updated: {
    type: Boolean,
    default: false
  },
  
  // System Fields
  applied_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Audit Trail
  status_history: [{
    from_status: String,
    to_status: String,
    changed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    },
    changed_at: {
      type: Date,
      default: Date.now
    },
    comments: String
  }]
}, {
  timestamps: true
});

// Leave Balance Schema
const leaveBalanceSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  leave_type_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  
  // Balance Details
  opening_balance: {
    type: Number,
    default: 0
  },
  allocated: {
    type: Number,
    default: 0
  },
  used: {
    type: Number,
    default: 0
  },
  pending: {
    type: Number,
    default: 0
  },
  encashed: {
    type: Number,
    default: 0
  },
  carried_forward: {
    type: Number,
    default: 0
  },
  lapsed: {
    type: Number,
    default: 0
  },
  
  // Computed Balance
  available_balance: {
    type: Number,
    default: 0
  },
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Indexes
leaveTypeSchema.index({ tenant_id: 1, code: 1 });
leaveSchema.index({ tenant_id: 1, employee_id: 1, status: 1 });
leaveSchema.index({ tenant_id: 1, from_date: -1 });
leaveBalanceSchema.index({ tenant_id: 1, employee_id: 1, year: -1 }, { unique: true });

const LeaveType = mongoose.model('LeaveType', leaveTypeSchema);
const Leave = mongoose.model('Leave', leaveSchema);
const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

module.exports = {
  LeaveType,
  Leave,
  LeaveBalance
};