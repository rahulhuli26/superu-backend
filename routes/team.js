const express = require('express');
const router = express.Router();
const { inviteMember, invitedMembersList } = require('../controllers/teamController');

router.post('/invite', inviteMember);
router.post('/invitedMembersList', invitedMembersList)

module.exports = router;
