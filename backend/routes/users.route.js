if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const {getDB,connection} = require('../DB/mongo-client.js');
const app = express.Router();

const {ObjectId} = require('mongodb');

const port = process.env.PORT;

// Add cookie parser middleware
app.use(cookieParser());

// CREATE
app.post('/', async (req, res) => {
    try {
        const db = await getDB();
        const { password, ...otherUserData } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            ...otherUserData,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const insertUserData = await db.collection('Users').insertOne(userData);
        return res.status(201).json({ message: "User signed up successfully", data: insertUserData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// LOGIN ENDPOINT - Set username in cookie
app.post('/login', async (req, res) => {
    try {
        const db = await getDB();
        const { email, password } = req.body;
  
        // Fetch the user by email
        const user = await db.collection('Users').findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
  
        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        // Set username in cookie - httpOnly for security
        res.cookie('username', user.username || user.email, { 
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'strict'
        });
  
        // Exclude password from response
        const { password: userPassword, ...userWithoutPassword } = user;
        return res.status(200).json({ 
            message: "Login successful", 
            user: userWithoutPassword 
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// LOGOUT ENDPOINT - Clear cookie
app.post('/logout', (req, res) => {
    try {
        // Clear the username cookie
        res.clearCookie('username');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// READ
app.get('/users',async(req,res)=>{
    try{
        const db = await getDB();
        const readUserData = await db.collection('Users').find().toArray();
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
        const { password, ...otherUpdates } = req.body;

        // Hash new password if provided
        if (password) {
            otherUpdates.password = await bcrypt.hash(password, 10);
        }

        otherUpdates.updatedAt = new Date();

        const updateUserData = await db.collection('Users').updateOne(
            { _id: new ObjectId(id) },
            { $set: otherUpdates }
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
        const deleteUserData = await db.collection('Users').deleteOne({ _id: new ObjectId(id) });

        if (deleteUserData.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", data: deleteUserData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = app;