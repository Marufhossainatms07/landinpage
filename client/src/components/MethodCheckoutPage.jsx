// frontend/src/MethodCheckoutPage.jsx
import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './MethodCheckoutPage.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';


export default function MethodCheckoutPage() {
    const { paymentMethodName } = useParams();
    const location = useLocation();
    console.log("location.state in MethodCheckoutPage:", location.state);
    const orderTotal = location.state?.orderTotal || '0.00';
    const cartItems = location.state?.cartItems || [];
    const paymentInstructions = location.state?.paymentInstructions || {};
    const billingDetails = location.state?.billingDetails;
    const orderId = location.state?.orderId;
    console.log("MethodCheckoutPage received billingDetails from state:", billingDetails);
    console.log("MethodCheckoutPage received orderId from state:", orderId);


    const [transactionId, setTransactionId] = useState('');
    const [transactionIdError, setTransactionIdError] = useState('');
    const navigate = useNavigate();
    const [paymentConfirmationStatus, setPaymentConfirmationStatus] = useState(null);


    const handleTransactionIdChange = (event) => {
        setTransactionId(event.target.value);
        setTransactionIdError('');
        setPaymentConfirmationStatus(null);
    };

    const handleConfirmPayment = async () => {
        if (!transactionId.trim()) {
            setTransactionIdError('Please enter your Transaction ID.');
            setPaymentConfirmationStatus(null);
            return;
        }

        setPaymentConfirmationStatus('loading');
        setTransactionIdError('');

        try {
            const backendApiUrl = `/api/orders/${orderId}/confirm-payment`;

            const paymentData = {
                transactionId: transactionId,
                paymentMethodName: paymentMethodName
            };

            console.log("Sending payment confirmation data to backend:", paymentData);
            console.log("Confirming payment to URL:", backendApiUrl);

            const response = await axios.put(backendApiUrl, paymentData);

            console.log("Backend API Response:", response.data);

            if (response.data.message === "Payment confirmed successfully!") {
                setPaymentConfirmationStatus('success');
                navigate('/order-success', { state: { transactionId: transactionId, orderId: orderId } });
            } else {
                setPaymentConfirmationStatus('error');
                setTransactionIdError(response.data.message || 'Payment confirmation failed. Please try again.');
            }

        } catch (error) {
            console.error("Error during payment confirmation:", error);
            setPaymentConfirmationStatus('error');
            setTransactionIdError('An error occurred while confirming payment. Please try again later.');
        }
    };

    // **ADD THESE LOGS BEFORE THE return() statement:**
    console.log("Payment instructions in MethodCheckoutPage:", paymentInstructions); // Log paymentInstructions object
    console.log("Payment method name in MethodCheckoutPage:", paymentMethodName); // Log paymentMethodName
    const methodSpecificInstructions = paymentInstructions[paymentMethodName] || paymentInstructions.default;
    console.log("methodSpecificInstructions:", methodSpecificInstructions); // Log methodSpecificInstructions
    if (!methodSpecificInstructions) { // **Check if it's null/undefined**
        console.error("methodSpecificInstructions is unexpectedly null or undefined!");
    }

    return (
        <div className="method-checkout-container">
            <h1>{paymentMethodName} Payment</h1>
            <section className="checkout-summary">
                <h2>Order Summary</h2>
                {cartItems.map((item, index) => (
                    <div key={index} className="summary-item">
                        <p>{item.product.name} x {item.quantity} - ${ (item.product.price * item.quantity).toFixed(2) }</p>
                    </div>
                ))}
                <div className="summary-total">
                    <strong>Total: ${orderTotal}</strong>
                </div>
            </section>

            <section className="payment-instructions">
                <h2>Payment Instructions for {paymentMethodName}</h2>
                <div className="instruction-box">
                    {methodSpecificInstructions && methodSpecificInstructions.map((step, index) => ( // **Conditional rendering to prevent error**
                        <p key={index}>{index + 1}. {step}</p>
                    ))}
                </div>
            </section>

            <section className="transaction-id-input">
                <h2>Enter Transaction ID</h2>
                <div className="input-box">
                    <input
                        type="text"
                        id="transactionId"
                        placeholder="Your Transaction ID"
                        value={transactionId}
                        onChange={handleTransactionIdChange}
                        disabled={paymentConfirmationStatus === 'loading' || paymentConfirmationStatus === 'pending'}
                    />
                    {transactionIdError && <p className="error-message">{transactionIdError}</p>}
                </div>
            </section>

            <div className="confirm-button-container">
                <button
                    className="confirm-payment-button"
                    onClick={handleConfirmPayment}
                    disabled={paymentConfirmationStatus === 'loading' || paymentConfirmationStatus === 'pending'}
                >
                    {paymentConfirmationStatus === 'loading' ? 'Confirming Payment...' : 'Confirm Payment'}
                </button>

                {/* Payment Confirmation Messages */}
                {paymentConfirmationStatus === 'success' && (
                    <div className="payment-status-message success-message">
                        <FontAwesomeIcon icon={faCheckCircle} className="status-icon success-icon" />
                        Payment Successful!
                    </div>
                )}

                {paymentConfirmationStatus === 'error' && (
                    <div className="payment-status-message error-message general-error">
                        <FontAwesomeIcon icon={faTimesCircle} className="status-icon error-icon" />
                        Payment Confirmation Failed. Please try again later.
                        {transactionIdError && <p className="transaction-error-detail">{transactionIdError}</p>}
                    </div>
                )}

                {paymentConfirmationStatus === 'pending' && (
                    <div className="payment-status-message pending-message">
                        <FontAwesomeIcon icon={faClock} className="status-icon pending-icon" />
                        Order Placed, Awaiting Confirmation.
                        <p className="pending-detail">Thank you for your order! Your order is now placed and is pending manual payment confirmation. We will contact you soon to confirm your order status.</p>
                    </div>
                )}
            </div>
        </div>
    );
}