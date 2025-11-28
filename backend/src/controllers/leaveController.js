const { Leave, LeaveType, LeaveBalance } = require('../models/Leave');
const Employee = require('../models/Employee');
const workflowEngine = require('../services/workflowEngine');
const winston = require('winston');

// Employee Functions - Apply Leave with Complete Workflow
const applyLeave = async (req, res) => {
  try {
    const { leave_type_id, from_date, to_date, reason, is_half_day, half_day_session, contact_number, address_during_leave } = req.body;
    
    // Calculate total days
    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);
    const timeDiff = toDate.getTime() - fromDate.getTime();
    let total_days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    if (is_half_day) {
      total_days = 0.5;
    }

    // Validation: Check if dates are valid
    if (fromDate < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply leave for past dates'
      });
    }

    // Get leave type details
    const leaveType = await LeaveType.findById(leave_type_id);
    if (!leaveType) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leave type'
      });
    }

    // Check minimum notice period
    const daysDifference = Math.ceil((fromDate - new Date()) / (1000 * 60 * 60 * 24));
    if (daysDifference < leaveType.min_days_notice) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${leaveType.min_days_notice} days notice required for ${leaveType.name}`
      });
    }

    // Check maximum consecutive days
    if (total_days > leaveType.max_consecutive_days) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${leaveType.max_consecutive_days} consecutive days allowed for ${leaveType.name}`
      });
    }

    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      tenant_id: req.user.tenant_id,
      employee_id: req.user.id,
      leave_type_id,
      year: currentYear
    });

    if (!leaveBalance || leaveBalance.available_balance < total_days) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient leave balance',
        available_balance: leaveBalance?.available_balance || 0,
        requested_days: total_days
      });
    }

    // Get employee details with manager
    const employee = await Employee.findById(req.user.id).populate('reporting_manager');
    
    // Setup approval workflow
    const approvers = [];
    
    // Level 1: Manager (if exists)
    if (employee.reporting_manager) {
      approvers.push({
        level: 1,
        approver_id: employee.reporting_manager._id,
        approver_role: 'MANAGER',
        status: 'PENDING',
        is_required: true
      });
    }
    
    // Level 2: HR Manager (always required)
    const hrManager = await Employee.findOne({
      tenant_id: req.user.tenant_id,
      role: 'HR_MANAGER',
      status: 'ACTIVE'
    });
    
    if (hrManager) {
      approvers.push({
        level: employee.reporting_manager ? 2 : 1,
        approver_id: hrManager._id,
        approver_role: 'HR_MANAGER',
        status: 'PENDING',
        is_required: true
      });
    }

    // Create leave application
    const leave = await Leave.create({
      tenant_id: req.user.tenant_id,
      employee_id: req.user.id,
      leave_type_id,
      from_date: fromDate,
      to_date: toDate,
      total_days,
      is_half_day,
      half_day_session,
      reason,
      contact_number,
      address_during_leave,
      workflow: {
        current_level: 1,
        total_levels: approvers.length,
        approvers
      },
      status_history: [{
        from_status: null,
        to_status: 'PENDING',
        changed_by: req.user.id,
        comments: 'Leave application submitted'
      }],
      created_by: req.user.id
    });

    // Update pending balance
    await LeaveBalance.findByIdAndUpdate(leaveBalance._id, {
      $inc: { pending: total_days },
      $set: { available_balance: leaveBalance.available_balance - total_days }
    });

    // Send notifications
    const notifications = await notificationService.sendLeaveApplicationNotification(leave, employee, leaveType);
    
    // Update leave with notification status
    await Leave.findByIdAndUpdate(leave._id, {
      $push: { notifications_sent: { $each: notifications } }
    });

    winston.info(`Leave application submitted by ${employee.employee_id} for ${total_days} days`);

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully. Notifications sent to approvers.',
      data: {
        leave_id: leave._id,
        status: leave.status,
        total_days,
        approvers_count: approvers.length,
        notifications_sent: notifications.length
      }
    });

  } catch (error) {
    winston.error('Error applying leave:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying leave',
      error: error.message
    });
  }
};

// Employee Functions - Get My Leaves
const getMyLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {
      tenant_id: req.user.tenant_id,
      employee_id: req.user.id
    };
    
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate('leave_type_id', 'name code')
      .populate('approved_by', 'first_name last_name')
      .sort({ applied_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(filter);

    res.json({
      success: true,
      data: {
        leaves,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_records: total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaves',
      error: error.message
    });
  }
};

// Employee Functions - Get Leave Balance
const getMyLeaveBalance = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    const balances = await LeaveBalance.find({
      tenant_id: req.user.tenant_id,
      employee_id: req.user.id,
      year: currentYear
    }).populate('leave_type_id', 'name code');

    res.json({
      success: true,
      data: balances
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave balance',
      error: error.message
    });
  }
};

// Employee Functions - Cancel Leave
const cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    const leave = await Leave.findOne({
      _id: id,
      tenant_id: req.user.tenant_id,
      employee_id: req.user.id,
      status: { $in: ['PENDING', 'APPROVED'] }
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found or cannot be cancelled'
      });
    }

    // Update leave status
    leave.status = 'CANCELLED';
    leave.cancelled_by = req.user.id;
    leave.cancelled_at = new Date();
    leave.cancellation_reason = cancellation_reason;
    await leave.save();

    // Update leave balance
    await LeaveBalance.findOneAndUpdate(
      {
        tenant_id: req.user.tenant_id,
        employee_id: req.user.id,
        leave_type_id: leave.leave_type_id,
        year: new Date().getFullYear()
      },
      {
        $inc: { 
          pending: leave.status === 'PENDING' ? -leave.total_days : 0,
          used: leave.status === 'APPROVED' ? -leave.total_days : 0
        }
      }
    );

    res.json({
      success: true,
      message: 'Leave cancelled successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling leave',
      error: error.message
    });
  }
};

// HR Functions - Get All Leave Applications
const getAllLeaves = async (req, res) => {
  try {
    const { status, employee_id, page = 1, limit = 10 } = req.query;
    
    const filter = {
      tenant_id: req.user.tenant_id
    };
    
    if (status) filter.status = status;
    if (employee_id) filter.employee_id = employee_id;

    const leaves = await Leave.find(filter)
      .populate('employee_id', 'first_name last_name employee_id')
      .populate('leave_type_id', 'name code')
      .populate('approved_by', 'first_name last_name')
      .sort({ applied_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Leave.countDocuments(filter);

    res.json({
      success: true,
      data: {
        leaves,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_records: total
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaves',
      error: error.message
    });
  }
};

// Dynamic Approve/Reject Leave with Multi-level Workflow
const approveRejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body; // action: 'APPROVE' or 'REJECT'

    // Find leave with populated data
    const leave = await Leave.findOne({
      _id: id,
      tenant_id: req.user.tenant_id,
      status: { $in: ['PENDING', 'MANAGER_APPROVED'] }
    })
    .populate('employee_id')
    .populate('leave_type_id');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found or already processed'
      });
    }

    // Check if current user is authorized to approve at current level
    const currentApprover = leave.workflow.approvers.find(
      approver => approver.approver_id.toString() === req.user.id && 
                  approver.status === 'PENDING'
    );

    if (!currentApprover) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this leave at current stage'
      });
    }

    const approver = await Employee.findById(req.user.id);
    let newStatus = leave.status;
    let isWorkflowComplete = false;

    if (action === 'APPROVE') {
      // Update current approver status
      currentApprover.status = 'APPROVED';
      currentApprover.comments = comments;
      currentApprover.action_date = new Date();

      // Check if this is the final approval
      const pendingApprovers = leave.workflow.approvers.filter(a => a.status === 'PENDING');
      
      if (pendingApprovers.length === 0) {
        // All approvals complete
        newStatus = 'APPROVED';
        isWorkflowComplete = true;
        leave.final_approved_by = req.user.id;
        leave.final_approved_at = new Date();
        leave.balance_deducted = true;
        leave.balance_deduction_date = new Date();

        // Update leave balance - move from pending to used
        await LeaveBalance.findOneAndUpdate(
          {
            tenant_id: req.user.tenant_id,
            employee_id: leave.employee_id,
            leave_type_id: leave.leave_type_id,
            year: new Date().getFullYear()
          },
          {
            $inc: { 
              pending: -leave.total_days,
              used: leave.total_days
            }
          }
        );

        winston.info(`Leave fully approved for employee ${leave.employee_id.employee_id}`);
      } else {
        // Partial approval - move to next level
        if (currentApprover.approver_role === 'MANAGER') {
          newStatus = 'MANAGER_APPROVED';
          leave.workflow.current_level = 2;
        }
        winston.info(`Leave partially approved by ${approver.role} for employee ${leave.employee_id.employee_id}`);
      }

    } else if (action === 'REJECT') {
      // Rejection at any level terminates the workflow
      currentApprover.status = 'REJECTED';
      currentApprover.comments = comments;
      currentApprover.action_date = new Date();
      
      newStatus = 'REJECTED';
      isWorkflowComplete = true;
      leave.rejected_by = req.user.id;
      leave.rejected_at = new Date();
      leave.rejection_reason = comments;

      // Update leave balance - remove from pending and restore available
      const leaveBalance = await LeaveBalance.findOne({
        tenant_id: req.user.tenant_id,
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        year: new Date().getFullYear()
      });

      await LeaveBalance.findByIdAndUpdate(leaveBalance._id, {
        $inc: { pending: -leave.total_days },
        $set: { available_balance: leaveBalance.available_balance + leave.total_days }
      });

      winston.info(`Leave rejected by ${approver.role} for employee ${leave.employee_id.employee_id}`);
    }

    // Update leave status and add to history
    leave.status = newStatus;
    leave.status_history.push({
      from_status: leave.status_history[leave.status_history.length - 1]?.to_status || 'PENDING',
      to_status: newStatus,
      changed_by: req.user.id,
      comments: comments
    });

    await leave.save();

    // Send notifications
    const notifications = await notificationService.sendLeaveApprovalNotification(
      leave, 
      leave.employee_id, 
      leave.leave_type_id, 
      approver, 
      action
    );

    // Update notifications in leave record
    await Leave.findByIdAndUpdate(leave._id, {
      $push: { notifications_sent: { $each: notifications } }
    });

    // Update calendar if fully approved
    if (isWorkflowComplete && action === 'APPROVE') {
      await Leave.findByIdAndUpdate(leave._id, {
        calendar_updated: true
      });
    }

    res.json({
      success: true,
      message: `Leave ${action.toLowerCase()}d successfully`,
      data: {
        leave_id: leave._id,
        new_status: newStatus,
        workflow_complete: isWorkflowComplete,
        next_approver: isWorkflowComplete ? null : leave.workflow.approvers.find(a => a.status === 'PENDING')?.approver_role,
        notifications_sent: notifications.length
      }
    });

  } catch (error) {
    winston.error('Approve/Reject leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing leave',
      error: error.message
    });
  }
};

// HR Functions - Get Leave Types
const getLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find({
      $or: [
        { tenant_id: req.user.tenant_id },
        { tenant_id: null } // Global leave types
      ],
      is_active: true
    });

    res.json({
      success: true,
      data: leaveTypes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leave types',
      error: error.message
    });
  }
};

module.exports = {
  // Employee functions
  applyLeave,
  getMyLeaves,
  getMyLeaveBalance,
  cancelLeave,
  
  // HR functions
  getAllLeaves,
  approveRejectLeave,
  getLeaveTypes
};