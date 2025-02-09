if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
const {getDB,connection} = require('../DB/mongo-client.js');
const app = express.Router();

const {ObjectId} = require('mongodb');

const port = process.env.PORT;

// CREATE
app.post('/', async (req, res) => {
    try {
        const db = await getDB();
        const userData = {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const insertUserData = await db.insertOne(userData);
        return res.status(201).json({ message: "User signed up successfully", data: insertUserData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
// READ
app.get('/users',async(req,res)=>{
    try{
        const db = await getDB();
        const readUserData = await db.find().toArray();
        return res.status(200).json({message:"User data fetched successfully", data:readUserData});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
});

// UPDATE - Modify existing user data
app.put('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const { id } = req.params;
        const updatedUser = {
            ...req.body,
            updatedAt: new Date()
        };
        const updateUserData = await db.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedUser }
        );

        if (updateUserData.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", data: updateUserData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// DELETE - Remove a user
app.delete('/:id', async (req, res) => {
    try {
        const db = await getDB();
        const { id } = req.params;
        const deleteUserData = await db.deleteOne({ _id: new ObjectId(id) });

        if (deleteUserData.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", data: deleteUserData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = app;




