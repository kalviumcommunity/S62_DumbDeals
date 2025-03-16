if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors')
const {getDB,connection} = require('./DB/mongo-client.js');

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8080;

app.get('/', async (req, res) => {
    const checkStatus = await connection.connect();
    const readyState = connection.topology.isConnected()
    ? 'connected'
    : 'disconnected';
    res.send(`<h3>Database Connection Status : ${readyState}</h3>`);
});

app.use('/user-router', require('./routes/users.route.js'));
app.use("/product-router", require("./routes/product.route.js"));


app.listen(port,()=>{
    console.log(`Your server is running on port ${port}, http://localhost:${port}`);
});
