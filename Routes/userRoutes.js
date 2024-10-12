const express = require('express');
const { SignUp, Login, ForgotPassword, ResetPassword, search } = require('../controller/userController');
const { isAuthenticated } = require('../middleware/jwt');
const { User } = require('../middleware/rbac');

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/forgotPassword', ForgotPassword)
router.post('/resetPassword/:token', ResetPassword)
router.get('/searchProperties',isAuthenticated, User, search)

module.exports = router;