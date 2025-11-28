const workflowEngine = {
  // Leave approval workflow
  processLeaveApproval: async (leaveApplication, approverRole) => {
    try {
      const workflow = {
        EMPLOYEE: ['TEAM_LEAD', 'HR_MANAGER'],
        TEAM_LEAD: ['HR_MANAGER'],
        HR_MANAGER: ['COMPANY_ADMIN']
      };

      const nextApprovers = workflow[leaveApplication.employee_role] || [];
      
      return {
        success: true,
        nextApprovers,
        requiresApproval: nextApprovers.length > 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Send notification workflow
  sendNotification: async (type, data) => {
    try {
      console.log(`Notification sent: ${type}`, data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

module.exports = workflowEngine;