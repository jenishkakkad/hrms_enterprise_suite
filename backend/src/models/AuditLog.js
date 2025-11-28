const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'EXPORT']
  },
  resource: {
    type: String,
    required: true
  },
  resource_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ip_address: {
    type: String
  },
  user_agent: {
    type: String
  }
}, {
  timestamps: true
});

auditLogSchema.index({ tenant_id: 1, createdAt: -1 });
auditLogSchema.index({ user_id: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);