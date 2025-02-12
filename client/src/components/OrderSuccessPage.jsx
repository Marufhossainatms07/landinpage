import { useLocation } from 'react-router-dom';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
    const location = useLocation(); // Get location object
    const transactionId = location.state?.transactionId; // Access transactionId from state

    return (
        <div className="order-success-container">
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order!</p>
            <p>Your order is being processed and is awaiting manual payment confirmation.</p>
            {transactionId && ( // Conditionally display Transaction ID if available
                <p>Your Transaction ID is: <strong>{transactionId}</strong>. Please keep this for your records.</p>
            )}
            <p>We will contact you soon with updates on your order status.</p>

        </div>
    );
}