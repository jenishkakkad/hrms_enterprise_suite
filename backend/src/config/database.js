const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    winston.info(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for multi-tenant queries
    await createIndexes();
    
  } catch (error) {
    winston.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    // Multi-tenant indexes
    await mongoose.connection.db.collection('employees').createIndex({ tenant_id: 1, status: 1 });
    await mongoose.connection.db.collection('attendance_logs').createIndex({ tenant_id: 1, employee_id: 1, date: -1 });
    await mongoose.connection.db.collection('leaves').createIndex({ tenant_id: 1, employee_id: 1, status: 1 });
    await mongoose.connection.db.collection('payrolls').createIndex({ tenant_id: 1, employee_id: 1, month: -1, year: -1 });
    
    winston.info('Database indexes created successfully');
  } catch (error) {
    winston.error(`Index creation error: ${error.message}`);
  }
};

module.exports = connectDB;