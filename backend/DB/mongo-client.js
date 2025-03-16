if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}

const mongoClient = require('mongodb').MongoClient;

const connection = new mongoClient(process.env.DB_URL)
async function getDB(){
    const db = connection.db("S62_DumbDeals");

    await db.createCollection("Products").catch(err => {
        if (err.codeName !== "NamespaceExists") console.error("Error ensuring Products collection:", err);
    });

    return db;
}

module.exports = {getDB, connection};