const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getMyLeaveBalance,
  cancelLeave,
  getAllLeaves,
  approveRejectLeave,
  getLeaveTypes
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const DynamicAuth = require('../middleware/dynamicAuth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dynamic permission-based routes
router.get('/types', 
  DynamicAuth.checkPermission('LEAVE', 'READ'),
  getLeaveTypes
);

router.post('/apply', 
  DynamicAuth.checkPermission('LEAVE', 'CREATE', { own_data_only: true }),
  applyLeave
);

router.get('/my-leaves', 
  DynamicAuth.checkPermission('LEAVE', 'READ', { own_data_only: true }),
  getMyLeaves
);

router.get('/my-balance', 
  DynamicAuth.checkPermission('LEAVE', 'READ', { own_data_only: true }),
  getMyLeaveBalance
);

router.put('/cancel/:id', 
  DynamicAuth.checkPermission('LEAVE', 'UPDATE', { own_data_only: true }),
  cancelLeave
);

router.get('/all', 
  DynamicAuth.checkPermission('LEAVE', 'READ', { reporting_hierarchy: true }),
  getAllLeaves
);

router.put('/approve-reject/:id', 
  DynamicAuth.checkPermission('LEAVE', 'APPROVE', { reporting_hierarchy: true }),
  approveRejectLeave
);

module.exports = router;