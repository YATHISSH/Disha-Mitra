const express = require('express');
const router = express.Router();
const { createRole, listRolesByCompany } = require('../controller/roles');

router.post('/create', createRole);
router.get('/list/:company_id', listRolesByCompany);

module.exports = router;
