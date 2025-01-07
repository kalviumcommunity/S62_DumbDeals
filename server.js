if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const connectDatabase = require('./DB/database.js');

const app = express();
const port = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    const dbStatus = mongoose.connection.readyState===1?'Connected':'Not connected';
    res.send(`<h3>Database Connection Status : ${dbStatus}</h3>`);
})
app.get('/ping',(request,response)=>{
    response.send('Hello World!');
});

app.listen(port,()=>{
    connectDatabase();
    console.log(`Your server is running on http://localhost:${port}`);
});