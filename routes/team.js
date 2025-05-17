const express = require('express');
const router = express.Router();
const { inviteMember } = require('../controllers/teamController');

router.post('/invite', inviteMember);

module.exports = router;
