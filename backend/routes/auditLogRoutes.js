const express = require('express');
const { listActivityLogs } = require('../controller/auditLog');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All audit log routes require JWT
router.get('/', verifyToken, listActivityLogs);

module.exports = router;
