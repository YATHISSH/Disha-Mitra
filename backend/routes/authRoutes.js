const express = require('express');
const router = express.Router();
const {loginUser,registerUser,registerCompany,createUser,listUsersByCompany} = require('../controller/authenticate');
const { verifyToken } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/company-signup', registerCompany);
router.post('/create-user', verifyToken, createUser);
router.get('/users/:companyId', verifyToken, listUsersByCompany);

module.exports = router;
