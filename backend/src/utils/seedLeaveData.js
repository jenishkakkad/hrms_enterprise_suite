const { LeaveType, LeaveBalance } = require('../models/Leave');
const Employee = require('../models/Employee');

const seedLeaveData = async () => {
  try {
    console.log('🌱 Seeding leave data...');

    // Check if leave types already exist
    const existingLeaveTypes = await LeaveType.find();
    if (existingLeaveTypes.length > 0) {
      console.log('✅ Leave data already exists');
      return;
    }

    // Create default leave types
    const leaveTypes = await LeaveType.insertMany([
      {
        tenant_id: null, // Global leave type
        name: 'Annual Leave',
        code: 'AL',
        description: 'Annual vacation leave',
        annual_allocation: 21,
        max_consecutive_days: 15,
        min_days_notice: 7,
        max_carry_forward: 5,
        is_paid: true,
        requires_approval: true,
        is_encashable: true,
        applicable_gender: 'All'
      },
      {
        tenant_id: null,
        name: 'Sick Leave',
        code: 'SL',
        description: 'Medical leave for illness',
        annual_allocation: 12,
        max_consecutive_days: 7,
        min_days_notice: 0,
        max_carry_forward: 0,
        is_paid: true,
        requires_approval: true,
        is_encashable: false,
        applicable_gender: 'All'
      },
      {
        tenant_id: null,
        name: 'Casual Leave',
        code: 'CL',
        description: 'Short term personal leave',
        annual_allocation: 12,
        max_consecutive_days: 3,
        min_days_notice: 1,
        max_carry_forward: 2,
        is_paid: true,
        requires_approval: true,
        is_encashable: false,
        applicable_gender: 'All'
      },
      {
        tenant_id: null,
        name: 'Maternity Leave',
        code: 'ML',
        description: 'Maternity leave for female employees',
        annual_allocation: 180,
        max_consecutive_days: 180,
        min_days_notice: 30,
        max_carry_forward: 0,
        is_paid: true,
        requires_approval: true,
        is_encashable: false,
        applicable_gender: 'Female'
      },
      {
        tenant_id: null,
        name: 'Paternity Leave',
        code: 'PL',
        description: 'Paternity leave for male employees',
        annual_allocation: 15,
        max_consecutive_days: 15,
        min_days_notice: 7,
        max_carry_forward: 0,
        is_paid: true,
        requires_approval: true,
        is_encashable: false,
        applicable_gender: 'Male'
      }
    ]);

    // Get all employees to create leave balances
    const employees = await Employee.find({ status: 'ACTIVE' });
    const currentYear = new Date().getFullYear();

    // Create leave balances for all employees
    const leaveBalances = [];
    
    for (const employee of employees) {
      for (const leaveType of leaveTypes) {
        // Skip gender-specific leaves if not applicable
        if (leaveType.applicable_gender !== 'All' && 
            employee.gender && 
            employee.gender !== leaveType.applicable_gender) {
          continue;
        }

        const allocated = leaveType.annual_allocation;
        leaveBalances.push({
          tenant_id: employee.tenant_id,
          employee_id: employee._id,
          leave_type_id: leaveType._id,
          year: currentYear,
          allocated,
          available_balance: allocated,
          opening_balance: 0,
          used: 0,
          pending: 0,
          encashed: 0,
          carried_forward: 0,
          lapsed: 0
        });
      }
    }

    if (leaveBalances.length > 0) {
      await LeaveBalance.insertMany(leaveBalances);
    }

    console.log('✅ Leave data seeded successfully!');
    console.log(`📋 Created ${leaveTypes.length} leave types`);
    console.log(`💰 Created ${leaveBalances.length} leave balances`);

  } catch (error) {
    console.error('❌ Error seeding leave data:', error);
  }
};

module.exports = seedLeaveData;