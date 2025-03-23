if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
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


// LOGIN ENDPOINT - Set JWT token in cookie
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
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                username: user.username || user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        // Set JWT token in cookie - httpOnly for security
        res.cookie('token', token, { 
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'PRODUCTION' // Only use secure in production
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

// LOGOUT ENDPOINT - Clear token cookie
app.post('/logout', (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token');
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// READ - Protected with JWT verification
app.get('/users', verifyToken, async(req, res) => {
    try{
        const db = await getDB();
        const readUserData = await db.collection('Users').find().toArray();
        return res.status(200).json({message:"User data fetched successfully", data:readUserData});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
});

// UPDATE - Protected with JWT verification
app.put('/:id', verifyToken, async (req, res) => {
    try {
        const db = await getDB();
        const { id } = req.params;
        const { password, ...otherUpdates } = req.body;

        // Optional: Check if user is updating their own data or is an admin
        if (req.user.id !== id && !req.user.isAdmin) {
            return res.status(403).json({ message: "You can only update your own account" });
        }

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

// DELETE - Protected with JWT verification
app.delete('/:id', verifyToken, async (req, res) => {
    try {
        const db = await getDB();
        const { id } = req.params;
        
        // Optional: Check if user is deleting their own data or is an admin
        if (req.user.id !== id && !req.user.isAdmin) {
            return res.status(403).json({ message: "You can only delete your own account" });
        }
        
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