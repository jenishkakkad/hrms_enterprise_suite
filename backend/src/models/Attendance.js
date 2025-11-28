const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  
  // Punch Details
  punch_in: Date,
  punch_out: Date,
  break_time: Number, // in minutes
  total_hours: Number,
  overtime_hours: Number,
  
  // Location Details (for geo-attendance)
  punch_in_location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  punch_out_location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  // Device Details
  device_info: {
    ip_address: String,
    user_agent: String,
    device_type: String // 'web', 'mobile', 'biometric'
  },
  
  // Face Recognition (for face attendance)
  face_data: {
    confidence_score: Number,
    image_path: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'EARLY_EXIT', 'ON_LEAVE'],
    default: 'PRESENT'
  },
  
  // Flags
  is_late: {
    type: Boolean,
    default: false
  },
  late_minutes: {
    type: Number,
    default: 0
  },
  is_early_exit: {
    type: Boolean,
    default: false
  },
  early_exit_minutes: {
    type: Number,
    default: 0
  },
  
  // Manual Entry
  is_manual: {
    type: Boolean,
    default: false
  },
  manual_reason: String,
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  
  // Shift Details
  shift_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift'
  },
  expected_in: Date,
  expected_out: Date,
  
  // Comments
  comments: String,
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Monthly Summary Schema
const attendanceSummarySchema = new mongoose.Schema({
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
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  
  // Summary Counts
  total_working_days: Number,
  present_days: Number,
  absent_days: Number,
  half_days: Number,
  leave_days: Number,
  holiday_days: Number,
  
  // Time Summary
  total_hours_worked: Number,
  total_overtime_hours: Number,
  average_in_time: String,
  average_out_time: String,
  
  // Discipline
  late_count: Number,
  early_exit_count: Number,
  total_late_minutes: Number,
  total_early_exit_minutes: Number,
  
  // Payroll Impact
  payable_days: Number,
  loss_of_pay_days: Number,
  
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }
}, {
  timestamps: true
});

// Indexes
attendanceLogSchema.index({ tenant_id: 1, employee_id: 1, date: -1 });
attendanceLogSchema.index({ tenant_id: 1, date: -1 });
attendanceLogSchema.index({ tenant_id: 1, status: 1 });

attendanceSummarySchema.index({ tenant_id: 1, employee_id: 1, year: -1, month: -1 }, { unique: true });

const AttendanceLog = mongoose.model('AttendanceLog', attendanceLogSchema);
const AttendanceSummary = mongoose.model('AttendanceSummary', attendanceSummarySchema);

module.exports = {
  AttendanceLog,
  AttendanceSummary
};