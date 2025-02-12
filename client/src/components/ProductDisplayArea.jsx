// src/components/LandingPage/ProductDisplayArea.jsx

import PropTypes from 'prop-types'; // Import PropTypes at the top

const ProductDisplayArea = ({ products, handleAddToCart }) => {
  return (
    <main className="product-display-area">
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button className='add-to-cart-button' onClick={() => handleAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </main>
  );
};

ProductDisplayArea.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({ // products is an array of...
    _id: PropTypes.string.isRequired,        // each product object has these properties
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    // Add other product properties and their PropTypes here if you have more
  })).isRequired,
  handleAddToCart: PropTypes.func.isRequired,   // handleAddToCart is a required function
};

export default ProductDisplayArea;