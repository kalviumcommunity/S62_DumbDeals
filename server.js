if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
// const app = express();
// const port = 3000;
const dotenv = require('dotenv');
const connectDatabase = require('./DB/database.js');

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 3000;


app.get('/ping',(request,response)=>{
    response.send('Hello World!');
});

app.listen(port,()=>{
    connectDatabase();
    console.log(`Your server is running on http://localhost:${port}`);
});