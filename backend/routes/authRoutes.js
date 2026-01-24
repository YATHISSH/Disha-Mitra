const express = require('express');
const router = express.Router();
const {loginUser,registerUser,registerCompany,createUser,listUsersByCompany} = require('../controller/authenticate');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/company-signup', registerCompany);
router.post('/create-user', createUser);
router.get('/users/:companyId', listUsersByCompany);

module.exports = router;
