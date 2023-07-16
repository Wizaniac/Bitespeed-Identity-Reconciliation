require('dotenv').config()
const express = require('express');
const path = require('path')

const app = express();
app.use(express.json())


const PORT = process.env.PORT || 3500
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));