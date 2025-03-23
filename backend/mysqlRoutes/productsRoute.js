const express = require('express');
const { pool } = require('../DB/mysql.js')
const router = express.Router();

// CREATE Product
router.post('/', async (req, res) => {
    try {
        const { name, price, description, image, created_by } = req.body;
        
        if (!created_by) {
            return res.status(400).json({ message: "created_by field is required" });
        }
        
        // Validate user exists
        const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [created_by]);
        if (users.length === 0) {
            return res.status(400).json({ message: "User does not exist" });
        }
        
        // Insert product
        const [result] = await pool.query(
            'INSERT INTO products (name, price, description, image, created_by) VALUES (?, ?, ?, ?, ?)',
            [name, parseFloat(price), description, image, created_by]
        );
        
        res.status(201).json({ 
            message: "Product added successfully", 
            data: { id: result.insertId, name, price, description, image, created_by } 
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET Products by User (required by assignment)
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate user exists
        const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(400).json({ message: "User does not exist" });
        }
        
        // Get products by user
        const [products] = await pool.query(
            'SELECT * FROM products WHERE created_by = ?',
            [userId]
        );
        
        res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error fetching products for user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET All Products
router.get('/all', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.status(200).json({ data: products });
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

// GET Product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        
        if (products.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ data: products[0] });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// UPDATE Product
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image } = req.body;
        
        const [result] = await pool.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ? WHERE id = ?',
            [name, parseFloat(price), description, image, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ 
            message: "Product updated successfully", 
            data: { id, name, price, description, image } 
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// DELETE Product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;