// productRoutes.js
import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'; // Import your controller functions

import {
  createProductAdmin,
  getAllProductsAdmin,
  getProductByIdAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', addProduct); 
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// --- **NEW ADMIN Product Routes - ADD THESE ROUTES BELOW EXISTING ROUTES** ---
router.post('/admin/products', createProductAdmin); 
router.get('/api/admin/products', getAllProductsAdmin); 
router.get('/api/admin/products/:id', getProductByIdAdmin);
router.put('/api/admin/products/:id', updateProductAdmin);
router.delete('/api/admin/products/:id', deleteProductAdmin);

export default router;