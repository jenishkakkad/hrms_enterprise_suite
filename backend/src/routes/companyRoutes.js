const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Company routes' });
});

module.exports = router;