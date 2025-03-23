if(process.env.NODE_ENV !=='PRODUCTION'){
    require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../DB/mysql.js')
const router = express.Router();

// CREATE - Register a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        
        return res.status(201).json({ 
            message: "User signed up successfully", 
            data: { id: result.insertId, name, email } 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Fetch user by email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = users[0];
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        
        return res.status(200).json({ 
            message: "Login successful", 
            user: userWithoutPassword 
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: error.message });
    }
});

// READ - Get all users
router.get('/', async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, created_at, updated_at FROM users');
        return res.status(200).json({ 
            message: "Users fetched successfully", 
            data: users 
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: error.message });
    }
});

// UPDATE - Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        let query = 'UPDATE users SET ';
        const params = [];
        
        if (name) {
            query += 'name = ?, ';
            params.push(name);
        }
        
        if (email) {
            query += 'email = ?, ';
            params.push(email);
        }
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += 'password = ?, ';
            params.push(hashedPassword);
        }
        
        // Remove trailing comma and space
        query = query.slice(0, -2);
        
        query += ' WHERE id = ?';
        params.push(id);
        
        const [result] = await pool.query(query, params);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            message: "User updated successfully", 
            data: result 
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: error.message });
    }
});

// DELETE - Delete user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        return res.status(200).json({ 
            message: "User deleted successfully", 
            data: result 
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;