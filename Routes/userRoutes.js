const express = require('express');
const { SignUp, Login, ForgotPassword, ResetPassword } = require('../controller/userController');

const router = express.Router();

router.post('/signup', SignUp)
router.post('/login', Login)
router.post('/forgotPassword', ForgotPassword)
router.post('/resetPassword/:token', ResetPassword)

module.exports = router;