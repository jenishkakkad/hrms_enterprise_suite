const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  tenant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  module: { type: String, required: true }, // 'LEAVE', 'ATTENDANCE', 'PAYROLL', etc.
  config_key: { type: String, required: true },
  config_value: { type: mongoose.Schema.Types.Mixed, required: true },
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

systemConfigSchema.index({ tenant_id: 1, module: 1, config_key: 1 }, { unique: true });

module.exports = mongoose.model('SystemConfig', systemConfigSchema);