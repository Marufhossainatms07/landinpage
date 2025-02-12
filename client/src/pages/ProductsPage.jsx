// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useRef } from 'react';
import './ProductsPage.css';
import axios from 'axios';
import Notification from '../components/Notification'; 
import LoadingSpinner from '../components/LoadingSpinner'; 
const CLOUDINARY_CLOUD_NAME = 'dnh81etck';  
const CLOUDINARY_API_KEY = '551936213451346';    
const CLOUDINARY_UPLOAD_PRESET = 'Landing_Page';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [newProductDescription,  setNewProductDescription] = useState('');
    const [newProductPrice, setNewProductPrice]  = useState('');
    const [newProductImageUrl, setNewProductImageUrl] = useState(''); // State for Image URL (can be from URL input or Cloudinary upload)
    const [newProductCategory, setNewProductCategory] = useState('');
    const [newProductStockQuantity, setNewProductStockQuantity] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false); // Loading state for image upload
    const [uploadError, setUploadError] = useState(null);       // Error state for image upload
    const [useImageUrlInput, setUseImageUrlInput] = useState(false); // State to toggle between upload and URL input
    // --- NEW STATE FOR ADD PRODUCT FORM VALIDATION ERRORS ---
    const [addProductFormErrors, setAddProductFormErrors] = useState({ // State for add product form validation errors
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stockQuantity: ''
    });

    // --- NEW STATE FOR EDIT PRODUCT FORM VALIDATION ERRORS ---
    const [editProductFormErrors, setEditProductFormErrors] = useState({ // State for edit product form validation errors
        editProductName: '',
        editProductPrice: '',
        editProductDescription: '',
        editProductImageUrl: '',
        editProductCategory: '',
        editProductStockQuantity: ''
    });

    const fileInputRef = useRef(null); // useRef to access file input element

    const [uploadedFileName, setUploadedFileName] = useState(''); // NEW STATE: To store uploaded file name

    const [showEditProductForm, setShowEditProductForm] = useState(false); // NEW STATE: to control visibility of Edit form
    const [productToEdit, setProductToEdit] = useState(null); // NEW STATE: to store the product being edited
    const [editFormData, setEditFormData] = useState({});
    const [notificationMessage, setNotificationMessage] = useState(null); // NEW STATE: Notification message
    const [notificationType, setNotificationType] = useState(null);     // NEW STATE: Notification type ('success' or 'error')

// --- Move fetchProducts function definition OUTSIDE useEffect ---

            const fetchProducts = async () => {
                console.log("fetchProducts function is being called!");
                setLoading(true);
                setError(null);

                try {
                    const response = await axios.get('/api/products');
                    setProducts(response.data);
                    console.log("Products state after setting:", products); // ADD THIS LINE - to inspect products state AFTER setting
                    setLoading(false);
                    console.log("Fetched products:", response.data); // Keep this line to log API response
                } catch (err) {
                    console.error("Error fetching products:", err);
                    setError(err);
                    setLoading(false);
                }

            };

        // --- End of moved function ---

        // --- VALIDATION FUNCTIONS START ---
    const validateAddProductForm = (formData) => {
        let errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Product Name is required';
        }
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }
        if (!formData.imageUrl.trim()) {
            errors.imageUrl = 'Image URL is required';
        }
        if (!formData.category.trim()) {
            errors.category = 'Category is required';
        }
        if (!formData.stockQuantity.trim()) {
            errors.stockQuantity = 'Stock Quantity is required';
        }
        if (!formData.price.trim()) {
            errors.price = 'Price is required';
        } else if (isNaN(formData.price) || Number(formData.price) < 0) {
            errors.price = 'Price must be a valid non-negative number';
        }
        if (formData.stockQuantity && (isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0)) {
            errors.stockQuantity = 'Stock Quantity must be a valid non-negative number';
        }
        // You could add more validation rules here, e.g., for URL format

        return errors;
    };

    const validateEditProductForm = (formData) => {
        let errors = {};
        if (!formData.editProductName.trim()) {
            errors.editProductName = 'Product Name is required';
        }
        if (!formData.editProductDescription.trim()) {
            errors.editProductDescription = 'Description is required';
        }
        if (!formData.editProductImageUrl.trim()) {
            errors.editProductImageUrl = 'Image URL is required';
        }
        if (!formData.editProductCategory.trim()) {
            errors.editProductCategory = 'Category is required';
        }
        if (!formData.editProductStockQuantity.trim()) {
            errors.editProductStockQuantity = 'Stock Quantity is required';
        }
        if (!formData.editProductPrice.trim()) {
            errors.editProductPrice = 'Price is required';
        } else if (isNaN(formData.editProductPrice) || Number(formData.editProductPrice) < 0) {
            errors.editProductPrice = 'Price must be a valid non-negative number';
        }
        if (formData.editProductStockQuantity && (isNaN(formData.editProductStockQuantity) || Number(formData.editProductStockQuantity) < 0)) {
            errors.editProductStockQuantity = 'Stock Quantity must be a valid non-negative number';
        }
        // You could add more validation rules here

        return errors;
    };
    // --- VALIDATION FUNCTIONS END ---


        useEffect(() => {
            fetchProducts(); // Call fetchProducts when component mounts (now calling the component-scoped function)
        }, []);

        const handleAddProductButtonClick = () => {
            setShowAddProductForm(true); // Show the add product form when button is clicked
        };

        const handleEditProductButtonClick = (product) => {
            console.log("Edit button clicked for product:", product);
            setProductToEdit(product);
            setShowEditProductForm(true);
            setEditFormData({ // Initialize editFormData with product data
                editProductName: product.name,
                editProductPrice: product.price,
                editProductDescription: product.description,
                editProductImageUrl: product.imageUrl,
                editProductCategory: product.category,
                editProductStockQuantity: product.stockQuantity,

                // Add other fields as necessary, matching your product object properties

            });

        };

        const handleUpdateProductSubmit = async (e) => {
            e.preventDefault(); // Prevent default form submission (page reload)
        
            if (!productToEdit) {
                console.error("No product to edit selected."); // Defensive check
                return;
            }
        
            setLoading(true); // Start loading, show loading indicator (if you have one)
            setError(null);   // Clear any previous errors

            // --- VALIDATE EDIT PRODUCT FORM ---
            const validationErrors = validateEditProductForm({
                editProductName: editFormData.editProductName,
                editProductPrice: editFormData.editProductPrice,
                editProductDescription: editFormData.editProductDescription,
                editProductImageUrl: editFormData.editProductImageUrl,
                editProductCategory: editFormData.editProductCategory,
                editProductStockQuantity: editFormData.editProductStockQuantity
            });

            setEditProductFormErrors(validationErrors); // Update edit form error state

            if (Object.keys(validationErrors).length > 0) {
                // If validation errors, stop form submission
                console.log("Edit Product form validation errors:", validationErrors);
                return; // DO NOT proceed with API call
            }
            // --- END EDIT FORM VALIDATION ---
            
            setLoading(true);
            setError(null);
        
            try {
                const updatedProductData = { // Prepare updated product data object
                    name: editFormData.editProductName,
                    price: parseFloat(editFormData.editProductPrice), // Ensure price is a number
                    description: editFormData.editProductDescription,
                    imageUrl: editFormData.editProductImageUrl,
                    category: editFormData.editProductCategory,
                    stockQuantity: parseInt(editFormData.editProductStockQuantity), // Ensure stockQuantity is an integer
                    // ... include other fields from your form/product data as needed
                };
        
                // Make PUT or PATCH request to your backend API endpoint to update product
                const response = await axios.put(`/api/products/${productToEdit._id}`, updatedProductData); // Or use PATCH
        
                if (response.status === 200) { // Assuming 200 OK on successful update
                    console.log("Product updated successfully:", response.data);
        
                    // Update the products state to reflect the changes (e.g., refetch product list or update modified product in state)
                    fetchProducts(); // For simplicity, refetch the entire product list after update
                    setShowEditProductForm(false); // Hide edit form
                    setProductToEdit(null);     // Clear product to edit
                    setEditFormData({});          // Clear edit form data
                    setNotificationMessage("Product updated successfully!");
                    setNotificationType('success');
                } else {
                    console.error("Failed to update product. Status:", response.status);
                    setError(new Error(`Failed to update product. Server responded with status: ${response.status}`));
                    setNotificationMessage(`Failed to update product. Status: ${response.status}`); // Use notification
                    setNotificationType('error');
                }
        
        
            } catch (error) {
                console.error("Error updating product:", error);
                setError(error);
                setNotificationMessage("Error updating product. Please check console for details."); // Use notification
                setNotificationType('error');
            } finally {
                setLoading(false); // Stop loading, hide loading indicator
            }
        };

        const handleDeleteProduct = async (productId) => {
            // --- ADD CONFIRMATION DIALOG ---
            const confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone."); // Show confirmation dialog
            if (!confirmDelete) {
                return; // If user cancels, do nothing and exit function
            }
            // --- END CONFIRMATION DIALOG ---
        
            setLoading(true); // Start loading
            setError(null);   // Clear any previous errors
        
            try {
                // Make DELETE request to your backend API endpoint to delete product
                const response = await axios.delete(`/api/products/${productId}`); // DELETE request
        
                if (response.status === 204 || response.status === 200) { // Assuming 204 No Content or 200 OK on successful delete
                    console.log("Product deleted successfully. Product ID:", productId);
        
                    // Update the products state to reflect the deletion (e.g., refetch product list)
                    fetchProducts(); // Refetch the product list to update the table
                    setNotificationMessage("Product deleted successfully!");
                    setNotificationType('success');
                } else {
                    console.error(`Failed to delete product with ID ${productId}. Status: ${response.status}`);
                    setError(new Error(`Failed to delete product. Server responded with status: ${response.status}`));
                    setNotificationMessage(`Failed to delete product. Status: ${response.status}`); // Use notification
                    setNotificationType('error');
                }
        
            } catch (error) {
                console.error("Error deleting product:", error);
                setError(error);
                setNotificationMessage("Error deleting product. Please check console for details."); // Use notification
                setNotificationType('error');
            } finally {
                setLoading(false);
            }
        };

        const handleCancelEditProduct = () => {
            setShowEditProductForm(false); // Hide the edit form
            setProductToEdit(null); // Clear the product to edit
            // Optionally clear form fields if needed, but we'll handle form clearing later in the edit form implementation.
        };

        const handleCancelAddProduct = () => {
            setShowAddProductForm(false); // Hide the form
            // Optionally clear form fields here if needed (or in the submit/cancel handlers)
        };

        const handleAddProductSubmit = async (event) => {
            event.preventDefault();
    
                // --- VALIDATE ADD PRODUCT FORM ---
                const validationErrors = validateAddProductForm({
                    name: newProductName,
                    description: newProductDescription,
                    price: newProductPrice,
                    imageUrl: newProductImageUrl,
                    category: newProductCategory,
                    stockQuantity: newProductStockQuantity
                });

                setAddProductFormErrors(validationErrors); // Update error state

                if (Object.keys(validationErrors).length > 0) {
                    // If there are validation errors, stop form submission
                    console.log("Add Product form validation errors:", validationErrors);
                    return; // DO NOT proceed with API call
                }
                // --- END VALIDATION ---
            
                // --- Prepare new product object ---
                const newProductData = {
                    name: newProductName,
                    description: newProductDescription,
                    price: Number(newProductPrice),
                    imageUrl: newProductImageUrl,
                    category: newProductCategory,
                    stockQuantity: Number(newProductStockQuantity)
                };
            
                // --- ADD THESE console.log statements here: ---
                console.log("handleAddProductSubmit: Submitting product data:");
                console.log("Product Data:", newProductData); // Log the product data object right before sending
                // --- End of added console.log statements ---
            
            
                try {
                    const response = await axios.post('/api/products', newProductData);
                    console.log("Product created successfully:", response.data);
                    setNotificationMessage("Product added successfully!");
                    setNotificationType('success');
                    setShowAddProductForm(false);
                    clearAddProductForm();
                    fetchProducts();
            
                    } catch (error) {
                        console.error("Error creating product:", error);
                        setNotificationMessage("Failed to create product. Please check the form data and try again."); // Use notification
                        setNotificationType('error');
                        // No alert here - use notification instead
                    } finally {
                        setLoading(false);
                    }
                };
    
    
    const clearAddProductForm = () => { // Function to clear form fields
        setNewProductName('');
        setNewProductDescription('');
        setNewProductPrice('');
        setNewProductImageUrl('');
        setNewProductCategory('');
        setNewProductStockQuantity('');
    };


     // --- Image Upload Handlers ---
     const handleImageUpload = async (event) => {
        const file = event.target.files[0];
    
        if (!file) {
            return;
        }

        setUploadedFileName(file.name); // SET FILENAME STATE HERE
    
        setIsUploadingImage(true);
        setUploadError(null);
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload_preset'); // **Make sure upload_preset is appended**
    
    
        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload?key=${CLOUDINARY_API_KEY}`,
                
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );
    
            console.log("Cloudinary upload response:", response.data);
            setNewProductImageUrl(response.data.secure_url);
            setIsUploadingImage(false);
            setUploadError(null);
            setNotificationMessage("Image uploaded successfully!");
            setNotificationType('success');
    
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            setIsUploadingImage(false);
            setUploadError(error);
            alert("Image upload failed. Please try again.");
        }
    };

    

    if (loading) {
        return (
            <div className="loading-container"> {/* Container for centering spinner */}
                <LoadingSpinner />
                <p>Loading products...</p> {/* Optional loading text below spinner */}
            </div>
        );
    }

    if (error) {
        return <p className="error-message">Error loading products: {error.message}</p>;
    }


    return (
        <div className="products-page-container">
            <h1>Product Management</h1>
            <section className="products-section">
                <div className="products-header"> {/* Container for heading and button */}
                        <h2>Products</h2>
                        <button className="button-primary" onClick={handleAddProductButtonClick} disabled={loading}>Add Product</button> {/* Button to show add product form */}
                    </div>
                <div className="products-table-container"> {/* Container for table styling */}
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {/* Conditionally render product rows only if products array is not empty */}
                            {products && products.length > 0 ? ( // ADD THIS CONDITIONAL CHECK
                                products.map(product => (
                                    <tr key={product._id}>
                                    <td>
                                        {product.imageUrl && ( // Conditionally render image if imageUrl exists
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name} 
                                                className="product-thumbnail" // Style thumbnail in CSS
                                            />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>
                                        <button 
                                            className="button-primary"
                                            onClick={() => handleEditProductButtonClick(product)} disabled={loading} // Call handleEditProductButtonClick and pass the product
                                        >
                                            Edit
                                        </button>
                                        <button className="button-secondary" onClick={() => handleDeleteProduct(product._id)} disabled={loading}>Delete</button>
                                    </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {products.length === 0 && <p>No products found.</p>} {/* Message if no products */}
                </div>
            </section>

            {/* --- NEW EMPTY STATE HANDLING --- */}
            {!loading && !error && products.length === 0 && ( // Condition: Not loading, no error, and products array is empty
                <div className="empty-products">
                    <p>Click Add Products to add your first product.</p>
                </div>
            )}
            {/* --- END EMPTY STATE HANDLING --- */}

                        {/* === EDIT PRODUCT FORM SECTION START === */}
            {showEditProductForm && ( // Conditionally render Edit form if showEditProductForm is true
                <section className="edit-product-section"> 
                    <h2>Edit Product</h2>
                    <form className="edit-product-form" onSubmit={handleUpdateProductSubmit}>
                        {/* === PRODUCT NAME === */}
                        <div className="form-group">
                            <label htmlFor="editProductName">Product Name</label>
                            <input
                                type="text"
                                id="editProductName"
                                name="editProductName"
                                placeholder="Product Name"
                                value={editFormData.editProductName || ""} // Use editFormData.editProductName for value
                                onChange={(e) => setEditFormData({ ...editFormData, editProductName: e.target.value })} // Add onChange handler
                            />
                            {editProductFormErrors.editProductName && <p className="error-message">{editProductFormErrors.editProductName}</p>} {/* Display editProductName error */}
                        </div>

                        {/* === PRICE === */}
                        <div className="form-group">
                            <label htmlFor="editProductPrice">Price</label>
                            <input 
                                type="number" 
                                id="editProductPrice" 
                                name="editProductPrice" 
                                placeholder="Price" 
                                value={productToEdit ? productToEdit.price : ""} // PRE-FILL VALUE FROM productToEdit.price
                                onChange={(e) => setEditFormData({ ...editFormData, editProductPrice: e.target.value })}
                            />
                            {editProductFormErrors.editProductPrice && <p className="error-message">{editProductFormErrors.editProductPrice}</p>} {/* Display editProductPrice error */}
                        </div>

                        {/* === DESCRIPTION === */}
                        <div className="form-group">
                            <label htmlFor="editProductDescription">Description</label>
                            <textarea 
                                id="editProductDescription" 
                                name="editProductDescription" 
                                placeholder="Description"
                                rows="3" 
                                value={productToEdit ? productToEdit.description : ""} // PRE-FILL VALUE FROM productToEdit.description
                                onChange={(e) => setEditFormData({ ...editFormData, editProductdescriptione: e.target.value })}
                            />
                            {editProductFormErrors.editProductDescription && <p className="error-message">{editProductFormErrors.editProductDescription}</p>} {/* Display editProductDescription error */}
                        </div>

                        {/* === IMAGE URL === */}
                        <div className="form-group">
                            <label htmlFor="editProductImageUrl">Image URL</label>
                            <input 
                                type="url" 
                                id="editProductImageUrl" 
                                name="editProductImageUrl" 
                                placeholder="Image URL" 
                                value={productToEdit ? productToEdit.imageUrl : ""} // PRE-FILL VALUE FROM productToEdit.imageUrl
                                onChange={(e) => setEditFormData({ ...editFormData, editProductImageUrl: e.target.value })}
                            />
                            {editProductFormErrors.editProductImageUrl && <p className="error-message">{editProductFormErrors.editProductImageUrl}</p>} {/* Display editProductImageUrl error */}
                        </div>

                        {/* === CATEGORY === */}
                        <div className="form-group">
                            <label htmlFor="editProductCategory">Category</label>
                            <input 
                                type="text" 
                                id="editProductCategory" 
                                name="editProductCategory" 
                                placeholder="Category" 
                                value={productToEdit ? productToEdit.category : ""} // PRE-FILL VALUE FROM productToEdit.category
                                onChange={(e) => setEditFormData({ ...editFormData, editProductCategory: e.target.value })}
                            />
                            {editProductFormErrors.editProductCategory && <p className="error-message">{editProductFormErrors.editProductCategory}</p>} {/* Display editProductCategory error */}
                        </div>

                        {/* === STOCK QUANTITY === */}
                        <div className="form-group">
                            <label htmlFor="editProductStockQuantity">Stock Quantity</label>
                            <input 
                                type="number" 
                                id="editProductStockQuantity" 
                                name="editProductStockQuantity" 
                                placeholder="Stock Quantity" 
                                value={productToEdit ? productToEdit.stockQuantity : ""} // PRE-FILL VALUE FROM productToEdit.stockQuantity
                                onChange={(e) => setEditFormData({ ...editFormData, editProductStockQuantity: e.target.value })}
                            />
                            {editProductFormErrors.editProductStockQuantity && <p className="error-message">{editProductFormErrors.editProductStockQuantity}</p>} {/* Display editProductStockQuantity error */}
                        </div>


                        <div className="form-actions">
                            <button type="submit" className="button-primary" disabled={loading}>Update Product</button>
                            <button type="button" className="button-secondary" onClick={handleCancelEditProduct} disabled={loading}>Cancel Edit</button>

                        </div>
                    </form>
                </section>
            )}
            {/* === EDIT PRODUCT FORM SECTION END === */}
            
            {/* --- Add Product Form Section --- */}
            {showAddProductForm && ( // Conditionally render the form
                <section className="add-product-section">
                    <h2>Add New Product</h2>
                    {/* --- Modified form with onSubmit handler --- */}
                    <form className="add-product-form" onSubmit={handleAddProductSubmit}> {/* Add onSubmit handler to form */}
                        {/* --- Product Name --- */}
                        <div className="form-group">
                            <label htmlFor="product-name">Product Name:</label>
                            <input
                                type="text"
                                id="product-name"
                                value={newProductName}
                                onChange={(e) => {
                                    setNewProductName(e.target.value);
                                    setAddProductFormErrors({ ...addProductFormErrors, name: '' }); // Clear name error on input change
                                }}
                            />
                            {addProductFormErrors.name && <p className="error-message">{addProductFormErrors.name}</p>} {/* Display name error */}
                        </div>
                        {/* --- Description --- */}
                        <div className="form-group">
                            <label htmlFor="product-description">Description:</label>
                            <textarea 
                                id="product-description" 
                                value={newProductDescription} 
                                onChange={(e) => {
                                    setNewProductDescription(e.target.value);
                                    setAddProductFormErrors({ ...addProductFormErrors, description: '' }); // Clear description error on input change
                                }} />
                            {addProductFormErrors.description && <p className="error-message">{addProductFormErrors.description}</p>} {/* Display description error */}
                        </div>

                        {/* --- Price --- */}
                        <div className="form-group">
                            <label htmlFor="product-price">Price:</label>
                            <input 
                                type="number" 
                                id="product-price" 
                                value={newProductPrice} 
                                onChange={(e) => {
                                    setNewProductPrice(e.target.value);
                                    setAddProductFormErrors({ ...addProductFormErrors, price: '' }); // Clear price error on input change
                                }} 
                            />
                            {addProductFormErrors.price && <p className="error-message">{addProductFormErrors.price}</p>} {/* Display price error */}
                        </div>
                        {/* --- Image Upload Section --- */}
                        <div className="form-group image-upload-group">
                            <label>Product Image:</label> {/* General label */}

                            <div className="image-options"> {/* Container for upload/URL options */}
                                <div className="upload-option"> {/* Upload option */}
                                    <label htmlFor="product-image-upload" className="upload-label">Upload Image</label> {/* Label for file input button */}
                                    <input 
                                        type="file" 
                                        id="product-image-upload" 
                                        accept="image/*" 
                                        onChange= {(e) => {
                                            handleImageUpload(e); // Call handleImageUpload on file input change
                                            setAddProductFormErrors({ ...addProductFormErrors, imageUrl: '' }); // Clear image URL error on input change
                                        }} // Call handleImageUpload on file input change
                                        className="image-upload-input" 
                                        ref={fileInputRef} // Ref to clear file input later if needed
                                    />
                                    {uploadedFileName && <span className="uploaded-file-name">Selected file: {uploadedFileName}</span>}  {/* Display filename here */}
                                    {isUploadingImage && <p className="uploading-message">Uploading image...</p>}
                                    {uploadError && <p className="error-message">Image upload error: {uploadError.message}</p>}
                                </div>

                                <div className="url-option"> {/* URL option */}
                                    <label>
                                        <input 
                                            type="checkbox" 
                                            className="use-url-checkbox" 
                                            checked={useImageUrlInput} 
                                            onChange={(e) => {
                                                setUseImageUrlInput(e.target.checked);
                                                setAddProductFormErrors({ ...addProductFormErrors, imageUrl: '' }); // Clear image URL error on input change
                                            }} 
                                        /> Use Image URL instead
                                    </label>
                                    {useImageUrlInput && ( // Conditionally render URL input
                                        <input 
                                            type="url" 
                                            id="product-image-url" 
                                            placeholder="Enter image URL"
                                            value={newProductImageUrl} 
                                            onChange={(e) => {
                                                setNewProductImageUrl(e.target.value);
                                                setAddProductFormErrors({ ...addProductFormErrors, imageUrl: '' }); // Clear image URL error on input change
                                            }} 
                                            className="image-url-input" 
                                        />
                                    )}
                                </div>
                            </div>
                            {addProductFormErrors.imageUrl && <p className="error-message">{addProductFormErrors.imageUrl}</p>} {/* Display image URL error */}
                        </div>
                        {/* --- End Image Upload Section --- */}
                        {/* --- Category --- */}
                        <div className="form-group">
                            <label htmlFor="product-category">Category:</label>
                            <input 
                                type="text" 
                                id="product-category" 
                                value={newProductCategory} 
                                onChange={(e) => 
                                    {
                                        setNewProductCategory(e.target.value);
                                        setAddProductFormErrors({ ...addProductFormErrors, category: '' }); // Clear category error on input change
                                    }
                                } />
                            {addProductFormErrors.category && <p className="error-message">{addProductFormErrors.category}</p>} {/* Display category error */}
                        </div>

                        {/* --- Stock Quantity --- */}
                        <div className="form-group">
                            <label htmlFor="product-stock">Stock Quantity:</label>
                            <input 
                                type="number" 
                                id="product-stock" 
                                value={newProductStockQuantity} 
                                onChange={(e) => {
                                    setNewProductStockQuantity(e.target.value);
                                    setAddProductFormErrors({ ...addProductFormErrors, stockQuantity: '' }); // Clear stock quantity error on input change
                                }} 
                            />
                            {addProductFormErrors.stockQuantity && <p className="error-message">{addProductFormErrors.stockQuantity}</p>} {/* Display stock quantity error */}
                        </div>

                        {/* --- Form Actions --- */}
                        <div className="form-actions">
                            <button type="submit" className="button-primary" disabled={loading}>Add Product</button>
                            <button type="button" className="button-secondary" onClick={handleCancelAddProduct}>Cancel</button>
                        </div>
                    </form>
                </section>
            )}
            {/* --- End Add Product Form Section --- */}

            {/* === NOTIFICATION COMPONENT === */}
            <Notification 
                message={notificationMessage} 
                type={notificationType} 
                onClose={() => setNotificationMessage(null)} // Clear message when notification closes
            />
        </div>
    );
}