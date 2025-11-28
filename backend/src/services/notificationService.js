const Employee = require('../models/Employee');
const { sendEmail } = require('./emailService');
const winston = require('winston');

class NotificationService {
  
  // Send leave application notification to manager/HR
  async sendLeaveApplicationNotification(leave, employee, leaveType) {
    try {
      // Get manager and HR
      const manager = await Employee.findById(employee.reporting_manager);
      const hrManagers = await Employee.find({
        tenant_id: employee.tenant_id,
        role: 'HR_MANAGER',
        status: 'ACTIVE'
      });

      const notifications = [];

      // Notify Manager
      if (manager) {
        const emailResult = await sendEmail({
          to: manager.official_email,
          subject: `Leave Application - ${employee.first_name} ${employee.last_name}`,
          template: 'leaveApplication',
          data: {
            manager_name: `${manager.first_name} ${manager.last_name}`,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            employee_id: employee.employee_id,
            leave_type: leaveType.name,
            from_date: leave.from_date.toLocaleDateString(),
            to_date: leave.to_date.toLocaleDateString(),
            total_days: leave.total_days,
            reason: leave.reason,
            applied_date: leave.applied_at.toLocaleDateString(),
            approval_url: `${process.env.FRONTEND_URL}/leaves/approvals`
          }
        });

        notifications.push({
          recipient_id: manager._id,
          type: 'APPLIED',
          status: emailResult.success ? 'SENT' : 'FAILED'
        });
      }

      // Notify HR Managers
      for (const hr of hrManagers) {
        const emailResult = await sendEmail({
          to: hr.official_email,
          subject: `New Leave Application - ${employee.first_name} ${employee.last_name}`,
          template: 'leaveApplicationHR',
          data: {
            hr_name: `${hr.first_name} ${hr.last_name}`,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            employee_id: employee.employee_id,
            leave_type: leaveType.name,
            from_date: leave.from_date.toLocaleDateString(),
            to_date: leave.to_date.toLocaleDateString(),
            total_days: leave.total_days,
            reason: leave.reason,
            manager_name: manager ? `${manager.first_name} ${manager.last_name}` : 'No Manager',
            approval_url: `${process.env.FRONTEND_URL}/leaves/approvals`
          }
        });

        notifications.push({
          recipient_id: hr._id,
          type: 'APPLIED',
          status: emailResult.success ? 'SENT' : 'FAILED'
        });
      }

      return notifications;

    } catch (error) {
      winston.error('Error sending leave application notifications:', error);
      return [];
    }
  }

  // Send leave approval notification
  async sendLeaveApprovalNotification(leave, employee, leaveType, approver, action) {
    try {
      const notifications = [];

      // Notify Employee
      const emailResult = await sendEmail({
        to: employee.official_email,
        subject: `Leave ${action} - ${leaveType.name}`,
        template: 'leaveApproval',
        data: {
          employee_name: `${employee.first_name} ${employee.last_name}`,
          leave_type: leaveType.name,
          from_date: leave.from_date.toLocaleDateString(),
          to_date: leave.to_date.toLocaleDateString(),
          total_days: leave.total_days,
          status: action,
          approver_name: `${approver.first_name} ${approver.last_name}`,
          comments: leave.workflow.approvers.find(a => a.approver_id.toString() === approver._id.toString())?.comments || '',
          action_date: new Date().toLocaleDateString()
        }
      });

      notifications.push({
        recipient_id: employee._id,
        type: action === 'APPROVED' ? 'APPROVED' : 'REJECTED',
        status: emailResult.success ? 'SENT' : 'FAILED'
      });

      // If manager approved, notify HR
      if (action === 'APPROVED' && approver.role !== 'HR_MANAGER') {
        const hrManagers = await Employee.find({
          tenant_id: employee.tenant_id,
          role: 'HR_MANAGER',
          status: 'ACTIVE'
        });

        for (const hr of hrManagers) {
          const hrEmailResult = await sendEmail({
            to: hr.official_email,
            subject: `Manager Approved Leave - ${employee.first_name} ${employee.last_name}`,
            template: 'leaveManagerApproved',
            data: {
              hr_name: `${hr.first_name} ${hr.last_name}`,
              employee_name: `${employee.first_name} ${employee.last_name}`,
              leave_type: leaveType.name,
              from_date: leave.from_date.toLocaleDateString(),
              to_date: leave.to_date.toLocaleDateString(),
              total_days: leave.total_days,
              manager_name: `${approver.first_name} ${approver.last_name}`,
              approval_url: `${process.env.FRONTEND_URL}/leaves/approvals`
            }
          });

          notifications.push({
            recipient_id: hr._id,
            type: 'APPROVED',
            status: hrEmailResult.success ? 'SENT' : 'FAILED'
          });
        }
      }

      return notifications;

    } catch (error) {
      winston.error('Error sending leave approval notifications:', error);
      return [];
    }
  }

  // Send leave cancellation notification
  async sendLeaveCancellationNotification(leave, employee, leaveType) {
    try {
      const notifications = [];

      // Get manager and HR
      const manager = await Employee.findById(employee.reporting_manager);
      const hrManagers = await Employee.find({
        tenant_id: employee.tenant_id,
        role: 'HR_MANAGER',
        status: 'ACTIVE'
      });

      // Notify Manager
      if (manager) {
        const emailResult = await sendEmail({
          to: manager.official_email,
          subject: `Leave Cancelled - ${employee.first_name} ${employee.last_name}`,
          template: 'leaveCancellation',
          data: {
            manager_name: `${manager.first_name} ${manager.last_name}`,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            leave_type: leaveType.name,
            from_date: leave.from_date.toLocaleDateString(),
            to_date: leave.to_date.toLocaleDateString(),
            cancellation_reason: leave.cancellation_reason,
            cancelled_date: new Date().toLocaleDateString()
          }
        });

        notifications.push({
          recipient_id: manager._id,
          type: 'CANCELLED',
          status: emailResult.success ? 'SENT' : 'FAILED'
        });
      }

      // Notify HR
      for (const hr of hrManagers) {
        const emailResult = await sendEmail({
          to: hr.official_email,
          subject: `Leave Cancelled - ${employee.first_name} ${employee.last_name}`,
          template: 'leaveCancellation',
          data: {
            manager_name: `${hr.first_name} ${hr.last_name}`,
            employee_name: `${employee.first_name} ${employee.last_name}`,
            leave_type: leaveType.name,
            from_date: leave.from_date.toLocaleDateString(),
            to_date: leave.to_date.toLocaleDateString(),
            cancellation_reason: leave.cancellation_reason,
            cancelled_date: new Date().toLocaleDateString()
          }
        });

        notifications.push({
          recipient_id: hr._id,
          type: 'CANCELLED',
          status: emailResult.success ? 'SENT' : 'FAILED'
        });
      }

      return notifications;

    } catch (error) {
      winston.error('Error sending leave cancellation notifications:', error);
      return [];
    }
  }

  // Send reminder notifications for pending approvals
  async sendPendingApprovalReminders() {
    try {
      const { Leave } = require('../models/Leave');
      
      // Get leaves pending for more than 24 hours
      const pendingLeaves = await Leave.find({
        status: { $in: ['PENDING', 'MANAGER_APPROVED'] },
        applied_at: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
      .populate('employee_id')
      .populate('leave_type_id');

      for (const leave of pendingLeaves) {
        // Find pending approvers
        const pendingApprovers = leave.workflow.approvers.filter(a => a.status === 'PENDING');
        
        for (const approver of pendingApprovers) {
          const approverEmployee = await Employee.findById(approver.approver_id);
          
          if (approverEmployee) {
            await sendEmail({
              to: approverEmployee.official_email,
              subject: `Reminder: Pending Leave Approval - ${leave.employee_id.first_name} ${leave.employee_id.last_name}`,
              template: 'leaveReminderApproval',
              data: {
                approver_name: `${approverEmployee.first_name} ${approverEmployee.last_name}`,
                employee_name: `${leave.employee_id.first_name} ${leave.employee_id.last_name}`,
                leave_type: leave.leave_type_id.name,
                from_date: leave.from_date.toLocaleDateString(),
                to_date: leave.to_date.toLocaleDateString(),
                days_pending: Math.floor((new Date() - leave.applied_at) / (1000 * 60 * 60 * 24)),
                approval_url: `${process.env.FRONTEND_URL}/leaves/approvals`
              }
            });
          }
        }
      }

      winston.info(`Sent reminder notifications for ${pendingLeaves.length} pending leaves`);

    } catch (error) {
      winston.error('Error sending reminder notifications:', error);
    }
  }
}

module.exports = new NotificationService();