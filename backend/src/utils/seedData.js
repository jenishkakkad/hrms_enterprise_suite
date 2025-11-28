const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Employee = require('../models/Employee');

const seedDemoData = async () => {
  try {
    console.log('🌱 Seeding demo data...');

    // Check if demo data already exists
    const existingCompany = await Company.findOne({ email: 'demo@company.com' });
    if (existingCompany) {
      console.log('✅ Demo data already exists');
      return;
    }
    
    // Create demo company
    const demoCompany = await Company.create({
      name: 'Demo Company Ltd',
      email: 'demo@company.com',
      phone: '+91-9876543210',
      industry: 'Technology',
      company_size: '51-200',
      admin: {
        name: 'Company Admin',
        email: 'admin@company.com',
        phone: '+91-9876543210'
      },
      subscription: {
        plan: 'GOLD',
        status: 'ACTIVE',
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      status: 'ACTIVE',
      limits: {
        employees: -1,
        hr_users: -1,
        storage_gb: -1,
        managers: -1
      },
      features: {
        payroll: true,
        performance: true,
        geo_attendance: true,
        face_attendance: true,
        multi_approval: true,
        workflows: true,
        integrations: true,
        white_labeling: true,
        ip_restriction: true
      }
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create demo employees
    const demoEmployees = [
      {
        tenant_id: demoCompany._id,
        employee_id: 'SUPER001',
        first_name: 'Super',
        last_name: 'Admin',
        official_email: 'superadmin@hrms.com',
        phone: '+91-9876543210',
        role: 'SUPER_ADMIN',
        date_of_joining: new Date(),
        status: 'ACTIVE',
        password: hashedPassword
      },
      {
        tenant_id: demoCompany._id,
        employee_id: 'ADMIN001',
        first_name: 'Company',
        last_name: 'Admin',
        official_email: 'admin@company.com',
        phone: '+91-9876543211',
        role: 'COMPANY_ADMIN',
        date_of_joining: new Date(),
        status: 'ACTIVE',
        password: hashedPassword
      },
      {
        tenant_id: demoCompany._id,
        employee_id: 'HR001',
        first_name: 'HR',
        last_name: 'Manager',
        official_email: 'hr@company.com',
        phone: '+91-9876543212',
        role: 'HR_MANAGER',
        date_of_joining: new Date(),
        status: 'ACTIVE',
        password: hashedPassword
      },
      {
        tenant_id: demoCompany._id,
        employee_id: 'EMP001',
        first_name: 'John',
        last_name: 'Doe',
        official_email: 'employee@company.com',
        phone: '+91-9876543214',
        role: 'EMPLOYEE',
        date_of_joining: new Date(),
        status: 'ACTIVE',
        password: hashedPassword
      }
    ];

    await Employee.insertMany(demoEmployees);

    console.log('✅ Demo data seeded successfully!');
    console.log('📧 Demo Login Credentials:');
    console.log('   Super Admin: superadmin@hrms.com / password123');
    console.log('   Company Admin: admin@company.com / password123');
    console.log('   HR Manager: hr@company.com / password123');
    console.log('   Employee: employee@company.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
};

module.exports = seedDemoData;