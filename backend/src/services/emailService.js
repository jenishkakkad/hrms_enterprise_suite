const nodemailer = require('nodemailer');
const winston = require('winston');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail({ to, subject, template, data, attachments = [] }) {
    try {
      const html = this.getEmailTemplate(template, data);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      winston.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      winston.error(`Failed to send email to ${to}:`, error);
      return { success: false, error: error.message };
    }
  }

  getEmailTemplate(template, data) {
    const templates = {
      welcome: this.welcomeTemplate(data),
      passwordReset: this.passwordResetTemplate(data),
      leaveApproval: this.leaveApprovalTemplate(data),
      leaveApplication: this.leaveApplicationTemplate(data),
      leaveApplicationHR: this.leaveApplicationHRTemplate(data),
      leaveManagerApproved: this.leaveManagerApprovedTemplate(data),
      leaveCancellation: this.leaveCancellationTemplate(data),
      leaveReminderApproval: this.leaveReminderApprovalTemplate(data),
      payslipGenerated: this.payslipGeneratedTemplate(data),
      attendanceAlert: this.attendanceAlertTemplate(data)
    };

    return templates[template] || this.defaultTemplate(data);
  }

  welcomeTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to HRMS SaaS!</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.admin_name}!</h2>
          <p>Welcome to the HRMS SaaS platform. Your company <strong>${data.company_name}</strong> has been successfully registered.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Account Details:</h3>
            <ul>
              <li><strong>Company:</strong> ${data.company_name}</li>
              <li><strong>Trial Period:</strong> ${data.trial_days} days</li>
              <li><strong>Login URL:</strong> <a href="${data.login_url}">${data.login_url}</a></li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.login_url}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Get Started
            </a>
          </div>
          
          <p>If you have any questions, feel free to contact our support team.</p>
          <p>Best regards,<br>HRMS SaaS Team</p>
        </div>
      </div>
    `;
  }

  passwordResetTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc3545; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.name}!</h2>
          <p>You requested a password reset for your HRMS account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.reset_url}" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <p>Best regards,<br>HRMS SaaS Team</p>
        </div>
      </div>
    `;
  }

  leaveApprovalTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${data.status === 'APPROVED' ? '#28a745' : '#dc3545'}; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Leave ${data.status}</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.employee_name}!</h2>
          <p>Your leave application has been <strong>${data.status.toLowerCase()}</strong>.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Leave Details:</h3>
            <ul>
              <li><strong>Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>From:</strong> ${data.from_date}</li>
              <li><strong>To:</strong> ${data.to_date}</li>
              <li><strong>Days:</strong> ${data.total_days}</li>
              <li><strong>Reason:</strong> ${data.reason}</li>
            </ul>
            ${data.comments ? `<p><strong>Comments:</strong> ${data.comments}</p>` : ''}
          </div>
          
          <p>Best regards,<br>HR Team</p>
        </div>
      </div>
    `;
  }

  payslipGeneratedTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #17a2b8; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Salary Slip Generated</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.employee_name}!</h2>
          <p>Your salary slip for <strong>${data.month} ${data.year}</strong> has been generated.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Salary Summary:</h3>
            <ul>
              <li><strong>Gross Salary:</strong> ₹${data.gross_salary}</li>
              <li><strong>Deductions:</strong> ₹${data.total_deductions}</li>
              <li><strong>Net Salary:</strong> ₹${data.net_salary}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.payslip_url}" style="background: #17a2b8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download Payslip
            </a>
          </div>
          
          <p>Best regards,<br>Payroll Team</p>
        </div>
      </div>
    `;
  }

  attendanceAlertTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ffc107; padding: 20px; text-align: center;">
          <h1 style="color: #212529; margin: 0;">Attendance Alert</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.employee_name}!</h2>
          <p>This is a reminder about your attendance:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>${data.message}</strong></p>
            <p>Date: ${data.date}</p>
            ${data.details ? `<p>Details: ${data.details}</p>` : ''}
          </div>
          
          <p>Please ensure regular attendance as per company policy.</p>
          <p>Best regards,<br>HR Team</p>
        </div>
      </div>
    `;
  }

  leaveApplicationTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3b82f6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🏖️ New Leave Application</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.manager_name}!</h2>
          <p>A new leave application has been submitted by your team member and requires your approval.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3>📋 Leave Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Employee:</strong> ${data.employee_name} (${data.employee_id})</li>
              <li><strong>📅 Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>🗓️ Duration:</strong> ${data.from_date} to ${data.to_date}</li>
              <li><strong>⏱️ Total Days:</strong> ${data.total_days}</li>
              <li><strong>📝 Reason:</strong> ${data.reason}</li>
              <li><strong>📆 Applied On:</strong> ${data.applied_date}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.approval_url}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">
              ✅ Review & Approve
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">⚡ Quick action required to avoid delays in team planning.</p>
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  leaveApplicationHRTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #8b5cf6; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🏢 Leave Application - HR Review</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.hr_name}!</h2>
          <p>A leave application has been submitted and is available for HR review.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <h3>📋 Application Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Employee:</strong> ${data.employee_name} (${data.employee_id})</li>
              <li><strong>👨‍💼 Manager:</strong> ${data.manager_name}</li>
              <li><strong>📅 Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>🗓️ Duration:</strong> ${data.from_date} to ${data.to_date}</li>
              <li><strong>⏱️ Total Days:</strong> ${data.total_days}</li>
              <li><strong>📝 Reason:</strong> ${data.reason}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.approval_url}" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              📊 HR Dashboard
            </a>
          </div>
          
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  leaveManagerApprovedTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">✅ Manager Approved - HR Action Required</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.hr_name}!</h2>
          <p>A leave application has been approved by the manager and now requires HR final approval.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3>📋 Approved Application:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Employee:</strong> ${data.employee_name}</li>
              <li><strong>✅ Approved by:</strong> ${data.manager_name}</li>
              <li><strong>📅 Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>🗓️ Duration:</strong> ${data.from_date} to ${data.to_date}</li>
              <li><strong>⏱️ Total Days:</strong> ${data.total_days}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.approval_url}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              🔍 Final HR Approval
            </a>
          </div>
          
          <p style="color: #666;">⚡ Final approval needed to complete the leave process.</p>
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  leaveCancellationTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🚫 Leave Cancelled</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.manager_name}!</h2>
          <p>A leave application has been cancelled by the employee.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3>📋 Cancelled Leave:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Employee:</strong> ${data.employee_name}</li>
              <li><strong>📅 Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>🗓️ Duration:</strong> ${data.from_date} to ${data.to_date}</li>
              <li><strong>📝 Reason:</strong> ${data.cancellation_reason}</li>
              <li><strong>📆 Cancelled On:</strong> ${data.cancelled_date}</li>
            </ul>
          </div>
          
          <p>No further action is required from your side.</p>
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  leaveReminderApprovalTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">⏰ Reminder: Pending Leave Approval</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2>Hello ${data.approver_name}!</h2>
          <p>This is a friendly reminder about a pending leave approval that requires your attention.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3>⏳ Pending Approval:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>👤 Employee:</strong> ${data.employee_name}</li>
              <li><strong>📅 Leave Type:</strong> ${data.leave_type}</li>
              <li><strong>🗓️ Duration:</strong> ${data.from_date} to ${data.to_date}</li>
              <li><strong>⏰ Pending Since:</strong> ${data.days_pending} days</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.approval_url}" style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              🚀 Approve Now
            </a>
          </div>
          
          <p style="color: #666;">⚡ Quick action helps maintain team productivity and employee satisfaction.</p>
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  defaultTemplate(data) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6c757d; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">HRMS Notification</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <p>${data.message || 'You have a new notification from HRMS.'}</p>
          <p>Best regards,<br>HRMS Team</p>
        </div>
      </div>
    `;
  }

  // Bulk email sending
  async sendBulkEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push({ ...email, ...result });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Send email with retry logic
  async sendEmailWithRetry(emailData, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.sendEmail(emailData);
      
      if (result.success) {
        return result;
      }
      
      if (attempt < maxRetries) {
        winston.warn(`Email send attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    winston.error(`Failed to send email after ${maxRetries} attempts`);
    return { success: false, error: 'Max retries exceeded' };
  }
}

module.exports = new EmailService();