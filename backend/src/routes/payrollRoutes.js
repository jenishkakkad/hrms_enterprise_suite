const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Payroll routes' });
});

module.exports = router;