
import { useState, useEffect } from 'react'; 
import './OrdersPage.css'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';


const OrdersPage = () => {

const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true); 

useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true); 
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
            console.log("Fetched orders:", response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false); 
        }
    };
    fetchOrders();
}, []);

return (
    <div className="orders-page-container"> 
        <h1>Orders List</h1>
        {loading ? (
            <LoadingSpinner message="Loading orders..." />
        ) : (
            <section className="admin-section orders-section"> 
                <h2>Orders</h2>
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th> 
                                <th>Total</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{/* Customer Name */}</td>
                                    <td>${order.orderTotal}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.paymentStatus}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/admin/orders/${order._id}`} className="button-primary">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 ? (  
                        <div className="empty-orders">
                            <p><strong>No Orders Yet!</strong></p> 
                            <p>As soon as customers place orders, they will appear in this list.</p>
                            <p>Check back soon!</p> 
                        </div>
                    ) : null}  
                </div>
                
            </section>
        )}
    </div>
);
};

export default OrdersPage;