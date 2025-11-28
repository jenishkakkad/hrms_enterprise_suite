const cron = require('node-cron');
const notificationService = require('../services/notificationService');
const winston = require('winston');

class CronJobManager {
  
  startAllJobs() {
    this.startLeaveReminderJob();
    this.startLeaveBalanceUpdateJob();
    winston.info('All cron jobs started successfully');
  }

  // Send reminder notifications for pending leave approvals every day at 9 AM
  startLeaveReminderJob() {
    cron.schedule('0 9 * * *', async () => {
      try {
        winston.info('Running leave reminder job...');
        await notificationService.sendPendingApprovalReminders();
        winston.info('Leave reminder job completed');
      } catch (error) {
        winston.error('Error in leave reminder job:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    winston.info('Leave reminder job scheduled for 9:00 AM daily');
  }

  // Update leave balances at the beginning of each year
  startLeaveBalanceUpdateJob() {
    cron.schedule('0 0 1 1 *', async () => {
      try {
        winston.info('Running annual leave balance update job...');
        await this.updateAnnualLeaveBalances();
        winston.info('Annual leave balance update completed');
      } catch (error) {
        winston.error('Error in annual leave balance update:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    winston.info('Annual leave balance update job scheduled for January 1st');
  }

  async updateAnnualLeaveBalances() {
    const { LeaveType, LeaveBalance } = require('../models/Leave');
    const Employee = require('../models/Employee');
    
    try {
      const currentYear = new Date().getFullYear();
      const employees = await Employee.find({ status: 'ACTIVE' });
      const leaveTypes = await LeaveType.find({ is_active: true });

      for (const employee of employees) {
        for (const leaveType of leaveTypes) {
          // Skip gender-specific leaves if not applicable
          if (leaveType.applicable_gender !== 'All' && 
              employee.gender && 
              employee.gender !== leaveType.applicable_gender) {
            continue;
          }

          // Check if balance already exists for current year
          const existingBalance = await LeaveBalance.findOne({
            tenant_id: employee.tenant_id,
            employee_id: employee._id,
            leave_type_id: leaveType._id,
            year: currentYear
          });

          if (!existingBalance) {
            // Get previous year balance for carry forward
            const previousBalance = await LeaveBalance.findOne({
              tenant_id: employee.tenant_id,
              employee_id: employee._id,
              leave_type_id: leaveType._id,
              year: currentYear - 1
            });

            const carryForward = previousBalance ? 
              Math.min(previousBalance.available_balance, leaveType.max_carry_forward || 0) : 0;

            const allocated = leaveType.annual_allocation;

            await LeaveBalance.create({
              tenant_id: employee.tenant_id,
              employee_id: employee._id,
              leave_type_id: leaveType._id,
              year: currentYear,
              allocated,
              carried_forward: carryForward,
              available_balance: allocated + carryForward,
              opening_balance: carryForward,
              used: 0,
              pending: 0,
              encashed: 0,
              lapsed: 0
            });
          }
        }
      }

      winston.info(`Updated leave balances for ${employees.length} employees`);
    } catch (error) {
      winston.error('Error updating annual leave balances:', error);
    }
  }
}

module.exports = new CronJobManager();