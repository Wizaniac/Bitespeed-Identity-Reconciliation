const express = require('express');
const ContactController = require('../Controllers/ContactController');

const router = express.Router()

router.all('/',(req,res)=>{
    res.status(200).json({message:"Identity Reconciliation - Tushar Dugar"});
});
router.post('/addContact', ContactController.addContact);
router.post('/identify', ContactController.identifyContact);

module.exports = router;