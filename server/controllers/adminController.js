import Product from '../models/productModel.js';
import { cloudinary } from '../cloudinaryConfig.js';

// server/controllers/adminController.js
import Admin from '../models/adminModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'

dotenv.config(); // .env ফাইল থেকে ভেরিয়েবল লোড করার জন্য

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("\n--- Login Attempt ---");
        console.log("Login attempt for username:", username);

        const adminUser = await Admin.findOne({ username });
        console.log("Admin user from database:", adminUser);

        if (!adminUser) {
            console.log("Admin user NOT FOUND for username:", username);
            return res.status(401).json({ message: 'Invalid credentials - user not found' });
        }

        console.log("Found admin user:", adminUser.username);
        console.log("Stored hashed password (DB):", adminUser.password);

        // ADDED LOGGING HERE - BEFORE bcrypt.compare()
        console.log("Password to compare (plain text from login form):", password);
        console.log("Hashed password from DB (being used for comparison):", adminUser.password);


        // const isPasswordMatch = await adminUser.comparePassword(password);
        // console.log("Password comparison result:", isPasswordMatch);

        // if (!isPasswordMatch) {
        //     console.log("Password Mismatch DETECTED");
        //     return res.status(401).json({ message: 'Invalid credentials - password mismatch' });
        // } else {
        //     console.log("Password MATCHED successfully!");
        // }

        const token = jwt.sign(
            { adminId: adminUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    } finally {
        console.log("--- Login Attempt End ---\n");
    }
};




export const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' }); // Bad Request
        }

        // পাসওয়ার্ড হ্যাশ করুন
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // নতুন এডমিন ইউজার তৈরি করুন
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
        });

        // ডাটাবেসে সেভ করুন
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' }); // Created
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message }); // Server Error
    }
};


// Add a new product
export const addProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // ADDED LOGGING HERE to inspect 'file' and 'file.buffer'
        console.log("File object received by backend:", file);
        console.log("File buffer:", file.buffer);


        console.log("Uploading file to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.write(file.buffer); // Line 25 where error occurs - writing file.buffer
            uploadStream.end();
        });
        const imageUrl = uploadResult.secure_url;
        console.log("Image URL:", imageUrl);
        const newProduct = new Product({ name, price, description, imageUrl });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        let imageUrl = req.body.imageUrl;
        if (req.file) {
            const file = req.file;
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(file.buffer);
            });
            imageUrl = uploadResult.secure_url; // Get the image URL from Cloudinary if a new image is uploaded
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, description, imageUrl },
            { new: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};