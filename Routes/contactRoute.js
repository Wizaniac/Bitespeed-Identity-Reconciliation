const express = require('express');
const ContactController = require('../Controllers/ContactController');

const router = express.Router()

router.post('/addContact', ContactController.addContact);
router.post('/identify', ContactController.identifyContact);

module.exports = router;