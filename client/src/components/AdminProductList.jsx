import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';
import './AdminProductList.css';
const CLOUDINARY_CLOUD_NAME = 'dnh81etck';  
const CLOUDINARY_API_KEY = '551936213451346';    
const CLOUDINARY_UPLOAD_PRESET = 'Landing_Page';

const AdminProductList = () => {
// === State Variables (Copied from ProductsPage.jsx) ===
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// --- Add Product Form State ---
const [showAddProductForm, setShowAddProductForm] = useState(false);
const [newProductName, setNewProductName] = useState('');
const [newProductPrice, setNewProductPrice] = useState('');
const [newProductCategory, setNewProductCategory] = useState('');
const [newProductStockQuantity, setNewProductStockQuantity] = useState('');
const [newProductImageUrl, setNewProductImageUrl] = useState(''); // For image URL input
const [useImageUrlInput, setUseImageUrlInput] = useState(false); // To toggle between upload and URL
const [addProductFormErrors, setAddProductFormErrors] = useState({
    name: '',
    price: '',
    category: '',
    stockQuantity: '',
    imageUrl: '' // Error for image URL or upload
});
const fileInputRef = useRef(null); // Ref to clear file input
const [uploadedFileName, setUploadedFileName] = useState(''); // State to display uploaded file name
const [isUploadingImage, setIsUploadingImage] = useState(false);
const [uploadError, setUploadError] = useState(null);


// --- Edit Product Form State ---
const [editingProduct, setEditingProduct] = useState(null);
const [showEditProductForm, setShowEditProductForm] = useState(false);
const [editProductName, setEditProductName] = useState('');
const [editProductPrice, setEditProductPrice] = useState('');
const [editProductCategory, setEditProductCategory] = useState('');
const [editProductStockQuantity, setEditProductStockQuantity] = useState('');
const [editProductImageUrl, setEditProductImageUrl] = useState(''); // For edit image URL
const [useEditImageUrlInput, setUseEditImageUrlInput] = useState(false); // To toggle between upload and URL for edit form
const [editProductFormErrors, setEditProductFormErrors] = useState({
    name: '',
    price: '',
    category: '',
    stockQuantity: '',
    imageUrl: '' // Error for image URL or upload in edit form
});
const editFileInputRef = useRef(null); // Ref for edit image file input
const [uploadedEditFileName, setUploadedEditFileName] = useState(''); // State for uploaded file name in edit form
const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
const [uploadEditError, setUploadEditError] = useState(null);


// --- Notification State ---
const [notificationMessage, setNotificationMessage] = useState(null);
const [notificationType, setNotificationType] = useState(null);


// === Fetch Products Function (Modified API endpoint for Admin) ===
const fetchProducts = async () => {
    console.log("fetchProducts function is being called in AdminProductList!"); // Log to confirm function call
    setLoading(true);
    setError(null);
    try {
        // IMPORTANT: Changed API endpoint to fetch admin products
        const response = await axios.get('/api/admin/products'); // Fetch products from /api/admin/products for admin panel
        setProducts(response.data);
        console.log("Products state after setting in AdminProductList:", products); // Log products state after setting
        setLoading(false);
        console.log("Fetched admin products:", response.data); // Log fetched products
    } catch (err) {
        console.error("Error fetching admin products:", err);
        setError(err);
        setLoading(false);
    }
};


// === UseEffect to Fetch Products on Component Mount ===
useEffect(() => {
    fetchProducts();
}, []);


// === Handle Add Product Form Submission ===
const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddProductForm()) {
        return; // Stop submission if form is invalid
    }

    setLoading(true);
    setError(null);
    try {
        const productData = {
            name: newProductName,
            price: newProductPrice,
            category: newProductCategory,
            stockQuantity: newProductStockQuantity,
            imageUrl: useImageUrlInput ? newProductImageUrl : uploadedFileName ? uploadedFileName : '' // Use URL if checkbox is checked, otherwise use uploaded file name if available
        };


        await axios.post('/api/admin/', productData); //  Using /api/products endpoint for adding product (same as ProductsPage)
        setNotificationMessage('Product added successfully!');
        setNotificationType('success');
        setShowAddProductForm(false); // Hide the form after successful submission
        fetchProducts(); // Refresh product list
        resetAddProductForm(); // Clear the form
    } catch (err) {
        console.error("Error adding product:", err);
        setError(err);
        setNotificationMessage(`Error adding product: ${err.message}`);
        setNotificationType('error');
    } finally {
        setLoading(false);
    }
};

// === Handle Edit Product Form Submission ===
const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditProductForm()) {
        return; // Stop submission if edit form is invalid
    }

    setLoading(true);
    setError(null);
    try {
        const updatedProductData = {
            name: editProductName,
            price: editProductPrice,
            category: editProductCategory,
            stockQuantity: editProductStockQuantity,
            imageUrl: useEditImageUrlInput ? editProductImageUrl : uploadedEditFileName ? uploadedEditFileName : editingProduct.imageUrl // Use URL if checked, uploaded file if available, otherwise keep existing URL
        };


        await axios.put(`/api/products/${editingProduct._id}`, updatedProductData); // Using /api/products endpoint for editing (same as ProductsPage)
        setNotificationMessage('Product updated successfully!');
        setNotificationType('success');
        setShowEditProductForm(false); // Hide edit form
        fetchProducts(); // Refresh product list
        setEditingProduct(null);
        resetEditProductForm(); // Clear edit form
    } catch (err) {
        console.error("Error updating product:", err);
        setError(err);
        setNotificationMessage(`Error updating product: ${err.message}`);
        setNotificationType('error');
    } finally {
        setLoading(false);
    }
};


// === Handle Delete Product ===
const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
        return; // Do nothing if not confirmed
    }

    setLoading(true);
    setError(null);
    try {
        await axios.delete(`/api/products/${id}`); // Using /api/products endpoint for deleting (same as ProductsPage)
        setNotificationMessage('Product deleted successfully!');
        setNotificationType('success');
        fetchProducts(); // Refresh product list
    } catch (err) {
        console.error("Error deleting product:", err);
        setError(err);
        setNotificationMessage(`Error deleting product: ${err.message}`);
        setNotificationType('error');
    } finally {
        setLoading(false);
    }
};


// === Handle Input Change for Add Product Form ===
const handleInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
        case 'product-name':
            setNewProductName(value);
            setAddProductFormErrors({ ...addProductFormErrors, name: '' }); // Clear name error
            break;
        case 'product-price':
            setNewProductPrice(value);
            setAddProductFormErrors({ ...addProductFormErrors, price: '' }); // Clear price error
            break;
        case 'product-category':
            setNewProductCategory(value);
            setAddProductFormErrors({ ...addProductFormErrors, category: '' }); // Clear category error
            break;
        case 'product-stock':
            setNewProductStockQuantity(value);
            setAddProductFormErrors({ ...addProductFormErrors, stockQuantity: '' }); // Clear stock error
            break;
        case 'product-image-url': // For image URL input in add form
            setNewProductImageUrl(value);
            setAddProductFormErrors({ ...addProductFormErrors, imageUrl: '' }); // Clear image URL error
            break;
        default:
            break;
    }
};


// === Handle Input Change for Edit Product Form ===
const handleEditInputChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
        case 'edit-product-name':
            setEditProductName(value);
            setEditProductFormErrors({ ...editProductFormErrors, name: '' }); // Clear name error
            break;
        case 'edit-product-price':
            setEditProductPrice(value);
            setEditProductFormErrors({ ...editProductFormErrors, price: '' }); // Clear price error
            break;
        case 'edit-product-category':
            setEditProductCategory(value);
            setEditProductFormErrors({ ...editProductFormErrors, category: '' }); // Clear category error
            break;
        case 'edit-product-stock':
            setEditProductStockQuantity(value);
            setEditProductFormErrors({ ...editProductFormErrors, stockQuantity: '' }); // Clear stock error
            break;
        case 'product-image-url': // For image URL input in edit form (note: id is same as in add form, but in edit form section)
            setEditProductImageUrl(value);
            setEditProductFormErrors({ ...editProductFormErrors, imageUrl: '' }); // Clear image URL error
            break;
        default:
            break;
    }
};



// === Validate Add Product Form ===
const validateAddProductForm = () => {
    let isValid = true;
    const errors = {};

    if (!newProductName.trim()) {
        errors.name = 'Product name is required';
        isValid = false;
    }

    if (!newProductPrice.trim()) {
        errors.price = 'Price is required';
        isValid = false;
    } else if (isNaN(newProductPrice) || Number(newProductPrice) <= 0) {
        errors.price = 'Price must be a positive number';
        isValid = false;
    }

    if (!newProductCategory.trim()) {
        errors.category = 'Category is required';
        isValid = false;
    }

    if (!newProductStockQuantity.trim()) {
        errors.stockQuantity = 'Stock quantity is required';
        isValid = false;
    } else if (isNaN(newProductStockQuantity) || Number(newProductStockQuantity) < 0) {
        errors.stockQuantity = 'Stock quantity must be a non-negative number';
        isValid = false;
    }

    if (!useImageUrlInput) { // Only validate image upload if not using URL
        if (!uploadedFileName && !newProductImageUrl) { // Check both uploaded file AND imageUrl input
            errors.imageUrl = 'Product image is required';
            isValid = false;
        }
    } else {
        if (!newProductImageUrl.trim()) {
            errors.imageUrl = 'Image URL is required';
            isValid = false;
        } else if (!/(http(s?):)([/|.|\w|\s-])*\.(?:jpg|gif|png)/.test(newProductImageUrl)) {
            errors.imageUrl = 'Invalid image URL format. URL must end with .jpg, .gif, or .png';
            isValid = false;
        }
    }


    setAddProductFormErrors(errors);
    return isValid;
};


// === Validate Edit Product Form ===
const validateEditProductForm = () => {
    let isValid = true;
    const errors = {};

    if (!editProductName.trim()) {
        errors.name = 'Product name is required';
        isValid = false;
    }

    if (!editProductPrice.trim()) {
        errors.price = 'Price is required';
        isValid = false;
    } else if (isNaN(editProductPrice) || Number(editProductPrice) <= 0) {
        errors.price = 'Price must be a positive number';
        isValid = false;
    }

    if (!editProductCategory.trim()) {
        errors.category = 'Category is required';
        isValid = false;
    }

    if (!editProductStockQuantity.trim()) {
        errors.stockQuantity = 'Stock quantity is required';
        isValid = false;
    } else if (isNaN(editProductStockQuantity) || Number(editProductStockQuantity) < 0) {
        errors.stockQuantity = 'Stock quantity must be a non-negative number';
        isValid = false;
    }


    if (useEditImageUrlInput) { // Only validate image URL if using URL input
        if (!editProductImageUrl.trim()) {
            errors.imageUrl = 'Image URL is required';
            isValid = false;
        } else if (!/(http(s?):)([/|.|\w|\s-])*\.(?:jpg|gif|png)/.test(editProductImageUrl)) {
            errors.imageUrl = 'Invalid image URL format. URL must end with .jpg, .gif, or .png';
            isValid = false;
        }
    }


    setEditProductFormErrors(errors);
    return isValid;
};


// === Handle Image Upload for Add Product and Edit Product Forms (Reused) ===
const handleImageUpload = async (e, isEdit = false) => { 
    const file = e.target.files[0];
    if (!file) return;


    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET || 'unsigned_upload_preset');


    const setLoadingState = isEdit ? setIsUploadingEditImage : setIsUploadingImage;
    const setFileNameState = isEdit ? setUploadedEditFileName : setUploadedFileName;
    const setUploadErrorState = isEdit ? setUploadEditError : setUploadError;
    const setFormErrorsState = isEdit ? setEditProductFormErrors : setAddProductFormErrors;


    setLoadingState(true);
    setUploadErrorState(null);
    setFileNameState(''); // Clear previous file name


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



// === Handle Cancel Add Product Form ===
const handleCancelAddProduct = () => {
    setShowAddProductForm(false);
    resetAddProductForm();
};

// === Handle Cancel Edit Product Form ===
const handleCancelEditProduct = () => {
    setShowEditProductForm(false);
    setEditingProduct(null);
    resetEditProductForm();
};


// === Reset Add Product Form Fields ===
const resetAddProductForm = () => {
    setNewProductName('');
    setNewProductPrice('');
    setNewProductCategory('');
    setNewProductStockQuantity('');
    setNewProductImageUrl('');
    setUseImageUrlInput(false);
    setUploadedFileName('');
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear file input
    }
    setAddProductFormErrors({});
    setUploadError(null);
    setIsUploadingImage(false);

};

// === Reset Edit Product Form Fields ===
const resetEditProductForm = () => {
    setEditProductName('');
    setEditProductPrice('');
    setEditProductCategory('');
    setEditProductStockQuantity('');
    setEditProductImageUrl('');
    setUseEditImageUrlInput(false);
    setUploadedEditFileName('');
    if (editFileInputRef.current) {
        editFileInputRef.current.value = ''; // Clear file input
    }
    setEditProductFormErrors({});
    setUploadEditError(null);
    setIsUploadingEditImage(false);
};


return (
    <div className="admin-product-list"> {/* Container for Admin Product List Page */}
        <h2>Admin Product List</h2>


        {/* --- Add Product Button --- */}
        <div className="add-product-button-container">
            {!showAddProductForm && (
                <button className="button-primary" onClick={() => { setShowAddProductForm(true); setAddProductFormErrors({}) }}>
                    Add New Product
                </button>
            )}
        </div>


        {/* --- Product Table --- */}
        {loading ? (
            <div className="loading-container">
                <LoadingSpinner />
                <p>Loading products...</p>
            </div>
        ) : error ? (
            <p className="error-message">Error loading products: {error.message}</p>
        ) : (
            <div className="products-table-container">
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
                        {products && products.length > 0 ? (
                            products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="product-thumbnail"
                                            />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.stockQuantity}</td>
                                    <td>
                                            {/* Edit Button - Handlers copied from ProductsPage.jsx */}
                                        <button className="button-primary" onClick={() => {
                                            setEditingProduct(product);
                                            setShowEditProductForm(true);
                                            setEditProductFormErrors({});
                                        }} disabled={loading}>Edit</button>
                                            {/* Delete Button - Handler copied from ProductsPage.jsx */}
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
                {products.length === 0 && !loading && !error && <p>No products found.</p>}
            </div>
        )}


        {/* === Add Product Form Section (Copied from ProductsPage.jsx) === */}
        {showAddProductForm && (
            <section className="add-product-form-section">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProductSubmit} className="product-form">
                    {/* --- Product Name --- */}
                    <div className="form-group">
                        <label htmlFor="product-name">Product Name:</label>
                        <input
                            type="text"
                            id="product-name"
                            value={newProductName}
                            onChange={handleInputChange}
                        />
                        {addProductFormErrors.name && <p className="error-message">{addProductFormErrors.name}</p>} {/* Display name error */}
                    </div>


                    {/* --- Price --- */}
                    <div className="form-group">
                        <label htmlFor="product-price">Price:</label>
                        <input
                            type="number"
                            id="product-price"
                            value={newProductPrice}
                            onChange={handleInputChange}
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
                                        onChange={(e) => setUseImageUrlInput(e.target.checked)}
                                    /> Use Image URL instead
                                </label>
                                {useImageUrlInput && ( // Conditionally render URL input
                                    <input
                                        type="url"
                                        id="product-image-url"
                                        placeholder="Enter image URL"
                                        value={newProductImageUrl}
                                        onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                        {addProductFormErrors.category && <p className="error-message">{addProductFormErrors.category}</p>} {/* Display category error */}
                    </div>


                    {/* --- Stock Quantity --- */}
                    <div className="form-group">
                        <label htmlFor="product-stock">Stock Quantity:</label>
                        <input
                            type="number"
                            id="product-stock"
                            value={newProductStockQuantity}
                            onChange={handleInputChange}
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


        {/* === Edit Product Form Section (Copied from ProductsPage.jsx) === */}
        {showEditProductForm && editingProduct && (
            <section className="edit-product-form-section">
                <h3>Edit Product</h3>
                <form onSubmit={handleEditProductSubmit} className="product-form">
                    {/* --- Product Name (Edit Form) --- */}
                    <div className="form-group">
                        <label htmlFor="edit-product-name">Product Name:</label>
                        <input
                            type="text"
                            id="edit-product-name"
                            value={editProductName}
                            onChange={handleEditInputChange}
                        />
                        {editProductFormErrors.name && <p className="error-message">{editProductFormErrors.name}</p>}
                    </div>


                    {/* --- Price (Edit Form) --- */}
                    <div className="form-group">
                        <label htmlFor="edit-product-price">Price:</label>
                        <input
                            type="number"
                            id="edit-product-price"
                            value={editProductPrice}
                            onChange={handleEditInputChange}
                        />
                        {editProductFormErrors.price && <p className="error-message">{editProductFormErrors.price}</p>}
                    </div>


                    {/* --- Image Upload Section (Edit Form) --- */}
                    <div className="form-group image-upload-group">
                        <label>Product Image:</label>


                        <div className="image-options">
                            <div className="upload-option">
                                <label htmlFor="edit-product-image-upload" className="upload-label">Upload New Image</label>
                                <input
                                    type="file"
                                    id="edit-product-image-upload"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, true)} // handleImageUpload with isEdit=true for edit form
                                    className="image-upload-input"
                                    ref={editFileInputRef}
                                />
                                {uploadedEditFileName && <span className="uploaded-file-name">Selected file: {uploadedEditFileName}</span>}
                                {isUploadingEditImage && <p className="uploading-message">Uploading image...</p>}
                                {uploadEditError && <p className="error-message">Image upload error: {uploadEditError.message}</p>}
                            </div>


                            <div className="url-option">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="use-url-checkbox"
                                        checked={useEditImageUrlInput}
                                        onChange={(e) => setUseEditImageUrlInput(e.target.checked)}
                                    /> Use Image URL instead
                                </label>
                                {useEditImageUrlInput && (
                                    <input
                                        type="url"
                                        id="product-image-url" //  same id as in add form, but within edit form
                                        placeholder="Enter image URL"
                                        value={editProductImageUrl}
                                        onChange={handleEditInputChange}
                                        className="image-url-input"
                                    />
                                )}
                            </div>
                        </div>
                        {editProductFormErrors.imageUrl && <p className="error-message">{editProductFormErrors.imageUrl}</p>}
                    </div>
                    {/* --- End Image Upload Section (Edit Form) --- */}


                    {/* --- Category (Edit Form) --- */}
                    <div className="form-group">
                        <label htmlFor="edit-product-category">Category:</label>
                        <input
                            type="text"
                            id="edit-product-category"
                            value={editProductCategory}
                            onChange={handleEditInputChange}
                        />
                        {editProductFormErrors.category && <p className="error-message">{editProductFormErrors.category}</p>}
                    </div>


                    {/* --- Stock Quantity (Edit Form) --- */}
                    <div className="form-group">
                        <label htmlFor="edit-product-stock">Stock Quantity:</label>
                        <input
                            type="number"
                            id="edit-product-stock"
                            value={editProductStockQuantity}
                            onChange={handleEditInputChange}
                        />
                        {editProductFormErrors.stockQuantity && <p className="error-message">{editProductFormErrors.stockQuantity}</p>}
                    </div>


                    {/* --- Form Actions (Edit Form) --- */}
                    <div className="form-actions">
                        <button type="submit" className="button-primary" disabled={loading}>Update Product</button>
                        <button type="button" className="button-secondary" onClick={handleCancelEditProduct}>Cancel</button>
                    </div>
                </form>
            </section>
        )}
        {/* --- End Edit Product Form Section --- */}


        {/* === NOTIFICATION COMPONENT === */}
        <Notification
            message={notificationMessage}
            type={notificationType}
            onClose={() => setNotificationMessage(null)} // Clear message when notification closes
        />
    </div>
);
};

export default AdminProductList;