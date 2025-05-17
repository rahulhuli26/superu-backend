const express = require('express');
const { signup, verify } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.get('/verify', verify);

module.exports = router;
