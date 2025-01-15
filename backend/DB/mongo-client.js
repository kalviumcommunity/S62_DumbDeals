if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}

const mongoClient = require('mongodb').MongoClient;

const connection = new mongoClient(process.env.DB_URL)
async function getDB(){
    let db = connection.db("S62_DumbDeals");
    db=db.collection('Users');
    return db;
}

module.exports = {getDB, connection};