const express = require('express');
const { postProperties } = require('../controller/hostController');

const router = express.Router();
const upload = require('../utils/multer');
const { isAuthenticated } = require('../middleware/jwt');


router.post('/postProperties',upload.array('image', 5),isAuthenticated ,postProperties)


module.exports = router;