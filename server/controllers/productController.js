import Product from '../models/productModel.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
  const products = await Product.find(); // Fetch all products from the database
  res.status(200).json(products); 
  } catch (error) {
  console.error("Error fetching products:", error);
  res.status(500).send({ message: "Error fetching products", error: error });
  }
  };   
  
  
// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
  const product = await Product.findById(req.params.id); // Find product by ID
  if (!product) {
  return res.status(404).send({ message: "Product not found" }); // Respond with 404 if product not found
  }
  res.status(200).json(product); // Respond with the product and 200 status (OK)
  } catch (error) {
  console.error("Error fetching product by ID:", error);
  res.status(500).send({ message: "Error fetching product", error: error }); // Respond with 500 status and error message
  }
  };

// Add a new product
export const addProduct = async (req, res) => {
  try {
  const { name, price, description, imageUrl, category, stockQuantity } = req.body;
  
  // Create a new product instance
  const newProduct = new Product({
    name,
    price,
    description,
    imageUrl,
    category,
    stockQuantity,
  });
  
  // Save the new product to the database
  const savedProduct = await newProduct.save();
  
  res.status(201).json(savedProduct); // Respond with the saved product and 201 status (Created)
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).send({ message: "Error adding product", error: error }); // Respond with 500 status and error message
    }
    };


// Update a product
export const updateProduct = async (req, res) => {
  try {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { // Find and update product by ID
  new: true, // Return the modified document rather than the original
  runValidators: true, // Run model validators on update
  });
  if (!updatedProduct) {
  return res.status(404).send({ message: "Product not found" }); // Respond with 404 if product not found
  }
  res.status(200).json(updatedProduct); // Respond with the updated product and 200 status (OK)
  } catch (error) {
  console.error("Error updating product:", error);
  res.status(400).send({ message: "Error updating product", error: error }); // Respond with 400 status for validation errors
  // Note: Changed status to 400 for validation errors during update as per best practices
  }
  };
  

  // Controller function to delete a product by ID
export const deleteProduct = async (req, res) => {
  try {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id); // Find and delete product by ID
  if (!deletedProduct) {
  return res.status(404).send({ message: "Product not found" }); // Respond with 404 if product not found
  }
  res.status(200).send({ message: "Product deleted successfully" }); // Respond with success message and 200 status (OK)
  } catch (error) {
  console.error("Error deleting product:", error);
  res.status(500).send({ message: "Error deleting product", error: error }); // Respond with 500 status and error message
  }
  };


// Add a new product (for admin)
// --- **NEW ADMIN Controller Functions - ADD THESE BELOW EXISTING FUNCTIONS** ---

// Admin: Create a new product (POST /api/admin/products)
export const createProductAdmin = async (req, res) => {
  try {
      const productData = req.body; // Get product data from request body
      const createdProduct = await Product.create(productData); // Create new product in DB
      res.status(201).json({ message: "Product created successfully (Admin)", product: createdProduct }); // Respond with success and created product
  } catch (error) {
      res.status(500).json({ message: "Error creating product (Admin)", error: error.message }); // Respond with error
  }
};

// Admin: Get all products (for admin panel) (GET /api/admin/products)
export const getAllProductsAdmin = async (req, res) => {
  try {
      const products = await Product.find({}); // Get all products from DB
      res.status(200).json(products); // Respond with product list
  } catch (error) {
      res.status(500).json({ message: "Error fetching products (Admin)", error: error.message });
  }
};

// Admin: Get product by ID (for admin edit) (GET /api/admin/products/:id)
export const getProductByIdAdmin = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id); // Get product by ID from DB
      if (product) {
          res.status(200).json(product); // Respond with product data
      } else {
          res.status(404).json({ message: "Product not found (Admin)" }); // Product not found
      }
  } catch (error) {
      res.status(500).json({ message: "Error fetching product details (Admin)", error: error.message });
  }
};

// Admin: Update a product (PUT /api/admin/products/:id)
export const updateProductAdmin = async (req, res) => {
  try {
      const productId = req.params.id;
      const updates = req.body; // Get updates from request body

      const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true }); // Update product

      if (updatedProduct) {
          res.status(200).json({ message: "Product updated successfully (Admin)", product: updatedProduct }); // Respond with updated product
      } else {
          res.status(404).json({ message: "Product not found for update (Admin)" }); // Product not found
      }
  } catch (error) {
      res.status(500).json({ message: "Error updating product (Admin)", error: error.message });
  }
};

// Admin: Delete a product (DELETE /api/admin/products/:id)
export const deleteProductAdmin = async (req, res) => {
  try {
      const productId = req.params.id;
      const deletedProduct = await Product.findByIdAndDelete(productId); // Delete product

      if (deletedProduct) {
          res.status(200).json({ message: "Product deleted successfully (Admin)", product: deletedProduct }); // Respond with success and deleted product
      } else {
          res.status(404).json({ message: "Product not found for deletion (Admin)" }); // Product not found
      }
  } catch (error) {
      res.status(500).json({ message: "Error deleting product (Admin)", error: error.message });
  }
};