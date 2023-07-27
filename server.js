require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./databaseConnection')
const contactRoute = require('./Routes/contactRoute')

const app = express();
app.use(express.json())

app.use('/',(req,res)=>{
    res.status(200).json({message:"Identity Reconciliation - Tushar Dugar"});
});
app.use(contactRoute);

const PORT = process.env.PORT || 3500
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));