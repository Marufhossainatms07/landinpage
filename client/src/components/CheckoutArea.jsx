// src/components/LandingPage/CheckoutArea.jsx

import PropTypes from 'prop-types'; // Import PropTypes at the top
import './CheckoutArea.css';

const CheckoutArea = ({
  cartItems,
  billingDetailsFormRef,
  billingName, setBillingName,
  billingAddress, setBillingAddress,
  billingCountry, setBillingCountry,
  billingMobile, setBillingMobile,
  billingEmail, setBillingEmail,
  orderNotes, setOrderNotes,
  handleQuantityChange,
  handlePlaceOrderCOD,
  handlePayOnlineNow,
  showModal, closeModalHandler, modalContent, handleModalContinue,
  shippingOptions, 
  selectedShipping,
  handleShippingChange, 
}) => {

  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const totalWithShipping = cartTotal + selectedShipping.cost;


  return (
    <aside className="checkout-area" id="checkout-section">
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <div>
          <h3>Cart Items:</h3>
          <ul >
            {cartItems.map((cartItem, index) => (
              <li key={index} className="cart-item">
                <div className="cart-item-image">
        <img src={cartItem.product.imageUrl} alt={cartItem.product.name} style={{ maxWidth: '50px', maxHeight: '50px' }} />
    </div>
    <div className="cart-item-details">
        <div className="cart-item-price">Price: ${cartItem.product.price}</div>
        <div className="cart-item-quantity">Quantity: {cartItem.quantity}</div> {/* Keep Quantity value here */}
    </div>

    <div className="cart-item-subtotal"> {/* Move Subtotal here, OUTSIDE details */}
        Subtotal: ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
    </div>

                <div className="cart-item-quantity-controls">
                    <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                    <input
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        className="quantity-input"
                        onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            if (!isNaN(newQuantity) && newQuantity > 0) {
                                handleQuantityChange(index, newQuantity - cartItem.quantity);
                            } else if (e.target.value === "") {
                                handleQuantityChange(index, 1 - cartItem.quantity);
                            }
                        }}
                    />
                    <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>
            </li>
            ))}
          </ul>
          <div className="shipping-options">
            <h3>Shipping Options</h3>
            <div className="shipping-options-list"> {/* Container for radio buttons */}
              {shippingOptions.map((option, index) => (
                <div key={index} className="shipping-option-item"> {/* Individual option item */}
                  <input
                    type="radio"
                    id={`shipping-option-${index}`}
                    name="shipping-option"
                    value={option.name}
                    checked={selectedShipping.name === option.name}
                    onChange={handleShippingChange}
                  />
                  <label htmlFor={`shipping-option-${index}`}>
                    {option.name} - ${option.cost}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="cart-total">
              <strong>Total: ${totalWithShipping.toFixed(2)}</strong>  {/* Use totalWithShipping here */}
          </div>

          <div className="billing-form-wrapper" ref={billingDetailsFormRef}>
            <div className="billing-details-form">
              <h3>Billing Details</h3>
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input type="text" id="name" name="name" value={billingName} onChange={(e) => setBillingName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <textarea id="address" name="address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country:</label>
                  <input type="text" id="country" name="country" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number:</label>
                  <input type="tel" id="mobile" name="mobile" value={billingMobile} onChange={(e) => setBillingMobile(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input type="email" id="email" name="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="orderNotes">Order Notes (Optional):</label>
                  <textarea id="orderNotes" name="orderNotes" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="place-order-section">
        <button className="place-order-button" onClick={handlePlaceOrderCOD}>
          Place Order (COD)
        </button>
        <button className="pay-online-now-button" onClick={handlePayOnlineNow}>
          Pay Online Now
        </button>
      </div>

      {/* Modal moved inside CheckoutArea */}
      {showModal && (
        <div className="modal-overlay show">
          <div className={`modal-content show`}>
            <span className="modal-close" onClick={closeModalHandler}>&times;</span>
            {modalContent}
            <button onClick={handleModalContinue}>Continue</button>
          </div>
        </div>
      )}
    </aside>
  );
};

CheckoutArea.propTypes = {
  cartItems: PropTypes.arrayOf(PropTypes.shape({ // cartItems is an array of...
    product: PropTypes.shape({ // each item has a 'product' property which is an object
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      // ...add other product properties here if needed
    }).isRequired,
    quantity: PropTypes.number.isRequired, // and a 'quantity' property which is a number
  }).isRequired).isRequired, // cartItems array itself is required
  billingDetailsFormRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired, // Ref object
  billingName: PropTypes.string.isRequired,
  setBillingName: PropTypes.func.isRequired,
  billingAddress: PropTypes.string.isRequired,
  setBillingAddress: PropTypes.func.isRequired,
  billingCountry: PropTypes.string.isRequired,
  setBillingCountry: PropTypes.func.isRequired,
  billingMobile: PropTypes.string.isRequired,
  setBillingMobile: PropTypes.func.isRequired,
  billingEmail: PropTypes.string.isRequired,
  setBillingEmail: PropTypes.func.isRequired,
  orderNotes: PropTypes.string.isRequired,
  setOrderNotes: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handlePlaceOrderCOD: PropTypes.func.isRequired,
  handlePayOnlineNow: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  showModalHandler: PropTypes.func.isRequired,
  closeModalHandler: PropTypes.func.isRequired,
  modalContent: PropTypes.node,
  handleModalContinue: PropTypes.func.isRequired,
  shippingOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
  })).isRequired,
  selectedShipping: PropTypes.shape({
    name: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
  }).isRequired,
  handleShippingChange: PropTypes.func.isRequired,
};


export default CheckoutArea;