const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;
    
    const filter = {
      tenant_id: req.user.tenant_id,
      recipient_id: req.user.id
    };
    
    if (unread_only === 'true') {
      filter.status = 'UNREAD';
    }

    const notifications = await Notification.find(filter)
      .populate('sender_id', 'first_name last_name employee_id')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({
      ...filter,
      status: 'UNREAD'
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_records: total
        },
        unread_count: unreadCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        tenant_id: req.user.tenant_id,
        recipient_id: req.user.id
      },
      {
        status: 'READ',
        read_at: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany(
      {
        tenant_id: req.user.tenant_id,
        recipient_id: req.user.id,
        status: 'UNREAD'
      },
      {
        status: 'read',
        read_at: new Date()
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
});

// Get unread count
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      tenant_id: req.user.tenant_id,
      recipient_id: req.user.id,
      status: 'UNREAD'
    });

    res.json({
      success: true,
      data: { count }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message
    });
  }
});

module.exports = router;