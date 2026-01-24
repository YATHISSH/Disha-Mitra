const express = require('express');
const router = express.Router();
const { createRole, listRolesByCompany } = require('../controller/roles');
const { verifyToken } = require('../middleware/auth');

router.post('/create', verifyToken, createRole);
router.get('/list/:company_id', verifyToken, listRolesByCompany);

module.exports = router;
