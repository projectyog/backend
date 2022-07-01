require("express-async-errors");
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

dotenv.config({path : './config.env'});
require('./db');

const PORT =process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use('/api/v1',require('./routes/index.route'));
app.use((error,req,res,next)=>{
   res.status(500).json({error:error.message})
});

app.listen(PORT,()=>{
   console.log('Listening to port',PORT)
});

module.exports = app;