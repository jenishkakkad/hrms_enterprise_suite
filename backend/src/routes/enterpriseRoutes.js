const express = require('express');
const router = express.Router();
const {
  processAction,
  getDashboardData,
  getModuleConfig,
  updateSystemConfig
} = require('../controllers/enterpriseController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Dynamic action processing
router.post('/action', processAction);

// Dashboard data
router.get('/dashboard', getDashboardData);

// Module configuration
router.get('/module/:module/config', getModuleConfig);

// Update system configuration
router.put('/config', updateSystemConfig);

module.exports = router;