const express = require('express');
const app = express();
const port = 3000;

app.get('/ping',(request,response)=>{
    response.send('Hello World!');
});

app.listen(port,()=>{
    console.log(`Your server is running on http://localhost:${port}`);
});