import express from 'express';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../controllers/adminController.js';
import { loginAdmin, registerAdmin } from '../controllers/adminController.js'; // loginAdmin কন্ট্রোলার ইম্পোর্ট করুন
import upload from '../middleware/upload-middleware.js'; // CORRECT IMPORT!
import { getDashboardOverviewStats } from '../controllers/dashboardController.js'; // <-- Import the new controller function
import adminAuth from '../middleware/adminAuthMiddleware.js'; 

const router = express.Router();

// --- Admin Authentication Endpoints ---
router.post('/register', registerAdmin); 
router.post('/login', loginAdmin);

// --- PROTECT ALL ROUTES BELOW THIS LINE ---
router.use(adminAuth); 

// --- Product Endpoints ---
// Endpoint to add a new product
router.post('/admin/products', upload.single('image'), addProduct);

// Endpoint to update a product
router.put('/products/:id', upload.single('image'), updateProduct);

// Endpoint to delete a product
router.delete('/products/:id', deleteProduct);

// Endpoint to get all products (admin specific - all products, maybe for admin product list)
router.get('/products', getProducts); // <-- Changed route path to be consistent

// --- Dashboard Endpoints ---
// Endpoint to get dashboard overview statistics (ADD THIS ROUTE)
router.get('/dashboard/overview-stats', getDashboardOverviewStats); // <-- Use the new controller function


export default router;