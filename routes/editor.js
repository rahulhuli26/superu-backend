const express = require('express');
const router = express.Router();
const { saveDocument, loadDocument } = require('../controllers/editorController');

router.post('/save', saveDocument);
router.get('/:docId', loadDocument);

module.exports = router;
