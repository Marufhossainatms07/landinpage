// frontend/src/pages/OrderDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './OrderDetailsPage.css';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Status options

export default function OrderDetailsPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(''); // State for current status display (initially empty)

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                setOrder(response.data);
                setCurrentStatus(response.data.orderStatus); // Initialize currentStatus from fetched order
                setLoading(false);
                console.log("Fetched order details:", response.data);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError(err);
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;
        try {
            await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus }); // Send PUT request to update status
            setOrder({ ...order, orderStatus: newStatus }); // Optimistically update local order state
            setCurrentStatus(newStatus); // Update the displayed current status
            console.log(`Order status updated to: ${newStatus}`);
            // Optionally, display a success message to the user
        } catch (err) {
            console.error("Error updating order status:", err);
            setError(err); // Set error state
            // Optionally, display an error message to the user
            // You might want to revert the dropdown to the previous status in case of error
        }
    };


    if (loading) {
        return <p>Loading order details...</p>;
    }

    if (error) {
        return <p className="error-message">Error loading order details: {error.message}</p>;
    }

    if (!order) {
        return <p>Order not found.</p>;
    }


    return (
        <>
        {loading ? (
            <LoadingSpinner message="Loading order details..." />
        ) : (
                <div className="order-details-container">
                     <Link to="/admin/orders" className="button-secondary back-to-orders-button"> {/* Style as button-secondary or similar */}
                        &laquo; Back to Orders List 
                    </Link>
                    <h1>Order Details</h1>
                    <h2>Order ID: {orderId}</h2>

                    <section className="detail-section">
                        <h3>Order Information</h3>
                        
                        <p>Order Date: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                        {/* --- Status Display and Dropdown --- */}
                        <p>
                            Current Status: <strong>{currentStatus}</strong>
                        </p>
                        <div className="status-change-control">
                            <label htmlFor="order-status">Update Status:</label>
                            <select
                                id="order-status"
                                value={currentStatus} // Control the dropdown with currentStatus state
                                onChange={handleStatusChange}
                            >
                                {orderStatusOptions.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        {/* --- End Status Display and Dropdown --- */}
                        <p>Payment Method: {order.paymentMethod}</p>
                        <p>Order Total: ${order.orderTotal}</p>
                    </section>

                    <section className="detail-section">
                        <h3>Billing Details</h3>
                        <p>Name: {order.billingDetails.name}</p>
                        <p>Address: {order.billingDetails.address}, {order.billingDetails.country}</p>
                        <p>Mobile: {order.billingDetails.mobile}</p>
                        <p>Email: {order.billingDetails.email}</p>
                        {order.billingDetails.orderNotes && <p>Order Notes: {order.billingDetails.orderNotes}</p>}
                    </section>

                    <section className="detail-section">
                        <h3>Order Items</h3>
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="order-item">
                                <p>Product: {item.product?.name} (Product ID: {item.product?._id})</p>  {/* Use ?. to safely access name and _id */}
                                <p>Quantity: {item.quantity}</p>
                                <p>Price per item: ${item.product?.price}</p> {/* Use ?. to safely access price */}
                                <p>Subtotal: ${item.quantity * (item.product?.price || 0)}</p> {/* Use ?. and default to 0 if price is missing */}
                                <hr />
                            </div>
                        ))}
                    </section>

                </div>
            )}
        </>
    );
}