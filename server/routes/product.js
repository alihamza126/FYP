import express from 'express'
import { asyncWrapper } from '../helpers/asyncWrapper.js';
import Product from '../models/Product.js';

const productRouter = express.Router();





productRouter.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const category = req.query.category || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (category) {
            query.category = category;
        }

        const sortOptions = {};
        sortOptions[sort] = order;

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const productData = req.body;

        // Generate a unique ID if not provided
        if (!productData.id) {
            productData.id = Date.now().toString();
        }

        // Generate slug if not provided
        if (!productData.slug) {
            productData.slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const product = new Product(productData);
        await product.save();

        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error("Create product error:", error);

        if (error.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Duplicate product ID or slug",
            });
        } else {
            res.status(500).json({ success: false, message: "Server error" });
        }
    }
});



// GET /api/products/:id - Get single product
productRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, product });
    } catch (error) {
        console.error("Get product error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// PUT /api/products/:id - Update product (admin only)
productRouter.put("/:id", async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, product });
    } catch (error) {
        console.error("Update product error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE /api/products/:id - Delete product (admin only)
productRouter.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});



export default productRouter;
