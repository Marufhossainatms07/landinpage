import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import OrderSuccessPage from '../components/OrderSuccessPage';
import Footer from '../components/Footer';
import MainProductDisplay from '../components/MainProductDisplay'; // Import new components
import ProductDisplayArea from '../components/ProductDisplayArea';
import CheckoutArea from '../components/CheckoutArea';
import WhatsAppButton from '../components/WhatsAppButton';
import Navbar from '../components/NavBar'; 
import CustomerFeedback from '../components/CustomerFeedback';


const LandingPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState([]);
  
    const navigate = useNavigate();
    const billingDetailsFormRef = useRef(null);

    // Billing form state
    const [billingName, setBillingName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCountry, setBillingCountry] = useState('');
    const [billingMobile, setBillingMobile] = useState('');
    const [billingEmail, setBillingEmail] = useState('');
    const [orderNotes, setOrderNotes] = useState('');
  
    //modal
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
  
    const showModalHandler = (content) => {
      setModalContent(content);
      setShowModal(true);
    };
  
    const closeModalHandler = () => {
      setModalContent(null);
      setShowModal(false);
    };
  
    const handleModalContinue = () => {
      closeModalHandler();
      navigate('/');
    };

    //Customer Feedback
    const customerFeedbackList = [
      {
        author: "John Doe",
        rating: 5,
        comment: "Excellent product! Surpassed my expectations. Will definitely buy again.",
        avatarUrl: "https://via.placeholder.com/50x50/4CAF50/FFFFFF?text=JD" // Placeholder avatar URL - replace with actual URLs
      },
      {
        author: "Jane Smith6",
        rating: 4,
        comment: "Good quality and fast shipping.  Slight issue with color but overall satisfied.",
        avatarUrl: "https://via.placeholder.com/50x50/F44336/FFFFFF?text=JS" // Placeholder avatar URL
      },
      {
        author: "Peter Jones5",
        rating: 5,
        comment: "Amazing camping companion! Made my trip so much more enjoyable and comfortable.",
        avatarUrl: "https://via.placeholder.com/50x50/2196F3/FFFFFF?text=PJ" // Placeholder avatar URL
      },
      // Add more feedback objects here with avatarUrl
    ];
  
    const handleAddToCart = (product) => {
      const cartItem = { product: product, quantity: 1 };
      setCartItems([...cartItems, cartItem]);
      console.log("Product added to cart:", cartItem);
  
      // Improved scrolling logic:
      setTimeout(() => {  // <-- The crucial fix: wrap in setTimeout
        if (billingDetailsFormRef.current) {
            billingDetailsFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, 0); // Delay of 0ms is often sufficient
    };
  
    const handleQuantityChange = (indexToChange, change) => {
      const updatedCartItems = cartItems.map((item, index) => {
        if (index === indexToChange) {
          let newQuantity = item.quantity + change;
          if (newQuantity < 1) {
            newQuantity = 1;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    };
  
    const handlePayOnlineNow = async () => {
      if (cartItems.length === 0) {
        showModalHandler("Your cart is empty. Please add products to your cart before proceeding to online payment.");
        return;
      }
  
      const billingDetails = {
        name: billingName,
        address: billingAddress,
        country: billingCountry,
        mobile: billingMobile,
        email: billingEmail,
        orderNotes: orderNotes
      };
  
      const orderTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2);
      console.log("Preparing to create initial order for online payment...");
  
      try {
        const response = await axios.post('http://localhost:5000/api/orders/initiate-payment-order', {
          orderItems: cartItems,
          billingDetails: billingDetails,
          paymentMethod: 'PayNow',
          orderTotal: orderTotal
        });
  
        const orderId = response.data.order._id;
        console.log("Initial order created successfully, order ID:", orderId);
  
        navigate('/payment', {
          state: {
            orderId: orderId,
            cartItems: cartItems,
            orderTotal: orderTotal,
            billingDetails: billingDetails
          }
        });
  
      } catch (error) {
        console.error("Error creating initial order:", error);
        showModalHandler("Error initiating online payment process. Please try again.");
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      }
    };
  
    const handlePlaceOrderCOD = async () => {
      if (cartItems.length === 0) {
        showModalHandler("Your cart is empty. Please add products to your cart before placing a Cash On Delivery order.");
        return;
      }
  
      const billingDetails = {
        name: billingName,
        address: billingAddress,
        country: billingCountry,
        mobile: billingMobile,
        email: billingEmail,
        orderNotes: orderNotes
      };
  
      const orderData = {
        orderItems: cartItems,
        billingDetails: billingDetails,
        paymentMethod: 'COD',
        orderTotal: cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toFixed(2)
      };
  
      try {
        const response = await axios.post('http://localhost:5000/api/orders', orderData);
        const orderId = response.data.order._id;
        console.log("COD Order placed successfully!", response.data);
        showModalHandler(<OrderSuccessPage orderId={orderId} />);
        setCartItems([]);
  
      } catch (error) {
        console.error("Error placing COD order:", error);
        showModalHandler("Error placing COD order. Please try again.");
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      }
    };

    const shippingOptions = [
      { name: "Standard Shipping", cost: 5 },
      { name: "Express Shipping", cost: 10 },
    ];
    const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]); // Default to first option
  
    const handleShippingChange = (event) => {
      const selectedOptionName = event.target.value;
      const selectedOption = shippingOptions.find(option => option.name === selectedOptionName);
      console.log("Selected Option Name:", selectedOptionName); // Check the value from radio button
    console.log("Found Selected Option:", selectedOption);   // Check if option is found

    setSelectedShipping(selectedOption);

    console.log("Updated selectedShipping:", selectedShipping);
    };
  
    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        console.log("Fetching products...");
        try {
          const response = await axios.get('http://localhost:5000/api/products');
          setProducts(response.data);
          console.log("Products received:", response.data);
        } catch (error) {
          console.error('Error fetching products:', error);
          setError('Failed to fetch products.');
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }, []);




 if (loading) {
  return <div>Loading products...</div>;
 }
 if (error) {
  return <div>Error: {error}</div>;
 }

// --- NEW:  Separate Main Product and Other Products ---
const mainProduct = products.length > 0 ? products[0] : null; // Assume first product is the main one
// const childProducts = products.slice(1); // All products except the first one are "child" products


return (
  <div className="landing-page-container">
    <Navbar />
    {mainProduct && (
      <MainProductDisplay 
        mainProduct={mainProduct} 
        handleAddToCart={handleAddToCart} 
      />
    )}
    <ProductDisplayArea 
      products={products} 
      handleAddToCart={handleAddToCart} 
    />
    <CustomerFeedback feedbackList={customerFeedbackList} />
    <CheckoutArea 
      cartItems={cartItems}
      billingDetailsFormRef={billingDetailsFormRef}
      billingName={billingName} setBillingName={setBillingName}
      billingAddress={billingAddress} setBillingAddress={setBillingAddress}
      billingCountry={billingCountry} setBillingCountry={setBillingCountry}
      billingMobile={billingMobile} setBillingMobile={setBillingMobile}
      billingEmail={billingEmail} setBillingEmail={setBillingEmail}
      orderNotes={orderNotes} setOrderNotes={setOrderNotes}
      handleQuantityChange={handleQuantityChange}
      handlePlaceOrderCOD={handlePlaceOrderCOD}
      handlePayOnlineNow={handlePayOnlineNow}
      showModal={showModal} showModalHandler={showModalHandler} closeModalHandler={closeModalHandler} modalContent={modalContent} handleModalContinue={handleModalContinue}
      shippingOptions={shippingOptions} 
      selectedShipping={selectedShipping} 
      handleShippingChange={handleShippingChange} 
      />
    <WhatsAppButton phoneNumber="YOUR_PHONE_NUMBER_HERE" message="Hello, I have a question about your camping products!" />
    <Footer />
  </div>
);
};

export default LandingPage;