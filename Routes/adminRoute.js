const express = require('express');
const { Admin } = require('../middleware/rbac');
const getUser = require('../controller/adminContoller');
const { isAuthenticated } = require('../middleware/jwt');

const router = express.Router();


router.get('/getuser',isAuthenticated, Admin, getUser)

module.exports = router;