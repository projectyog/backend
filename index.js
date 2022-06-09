require("express-async-errors");
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');

dotenv.config({path : './config.env'});
require('./db');

const port = 8080;

app.use(cors());
app.use('/api/v1',require('./routes/index.route'));

app.use((error,req,res,next)=>{
   res.status(500).json({error:error.message})
});

app.listen(port,()=>{
   console.log('Listening to port',port)
});

module.exports = app;