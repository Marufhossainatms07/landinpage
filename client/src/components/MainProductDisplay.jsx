// src/components/LandingPage/MainProductDisplay.jsx

import PropTypes from 'prop-types'; // Import PropTypes at the top

const MainProductDisplay = ({ mainProduct, handleAddToCart }) => {
  return (
    <main className="main-product-display-area bold-style">
      <h2>🔥 Get Ready {mainProduct.name}! 🔥</h2>
      <div className="main-product-card product-card bold-style">
        <img src={mainProduct.imageUrl} alt={mainProduct.name} />
        <h3>Your Ultimate Camping Companion</h3>
        <p>Price: ${mainProduct.price}</p>
        <button className='add-to-cart-button bold-style' onClick={() => handleAddToCart(mainProduct)}>Yes, Take Me Camping!</button>
      </div>
    </main>
  );
};

MainProductDisplay.propTypes = {
  mainProduct: PropTypes.shape({ // mainProduct is expected to be an object with this shape
    _id: PropTypes.string.isRequired,    // Assuming _id is part of your product data
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    // Add other properties of your product object and their PropTypes here if needed
  }).isRequired,
  handleAddToCart: PropTypes.func.isRequired, // handleAddToCart is expected to be a function and is required
};

export default MainProductDisplay;