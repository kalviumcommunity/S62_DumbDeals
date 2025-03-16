const express = require("express");
const { getDB } = require("../DB/mongo-client.js");
const { ObjectId } = require("mongodb");

const router = express.Router();

// CREATE Product
router.post("/", async (req, res) => {
    try {
        const db = await getDB();
        const { name, price, description, image, created_by } = req.body;

        if (!created_by) {
            return res.status(400).json({ message: "created_by field is required" });
        }

        // Validate ObjectId
        let createdByObjectId;
        try {
            createdByObjectId = new ObjectId(created_by);
        } catch (error) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const newProduct = {
            name,
            price: parseFloat(price),
            description,
            image,
            created_by: createdByObjectId,
            createdAt: new Date(),
        };

        const result = await db.collection("Products").insertOne(newProduct);
        res.status(201).json({ message: "Product added successfully", data: result });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET Products by User
router.get("/user/:id", async (req, res) => {
    try {
        const db = await getDB();
        const userId = req.params.id;

        // Validate ObjectId
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const products = await db.collection("Products").find({ created_by: new ObjectId(userId) }).toArray();
        
        res.json({ data: products });
    } catch (err) {
        console.error("Error fetching products for user:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET All Products
router.get('/all', async (req, res) => {
    try {
        const db = await getDB();
        const products = await db.collection("Products").find().toArray();
        res.json({ data: products });
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

module.exports = router;