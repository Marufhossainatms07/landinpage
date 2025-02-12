// server/controllers/orderController.js
import Order from '../models/orderModel.js';
import { sendTestEmail } from './emailController.js'; 
import orderConfirmationEmailTemplate from '../orderConfirmationEmailTemplate.js';
import adminOrderNotificationEmailTemplate from '../adminOrderNotificationEmailTemplate.js';

const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']; // Define orderStatusOptions here

const ADMIN_EMAIL_ADDRESS = 'marufhossain458218@gmail.com'; // **REPLACE with your desired admin email address**

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const orderData = req.body; // Get order data from request body

        // Data type logging (added in previous response) - ENSURE THESE LINES ARE *AFTER* const orderData = req.body; and INSIDE try {}
        console.log("Data types before Order.create:");
        console.log("typeof orderTotal:", typeof orderData.orderTotal);
        console.log("typeof paymentMethod:", typeof orderData.paymentMethod);
        console.log("typeof billingDetails:", typeof orderData.billingDetails);
        console.log("typeof billingDetails.name:", typeof orderData.billingDetails.name);
        console.log("typeof billingDetails.email:", typeof orderData.billingDetails.email);
        console.log("typeof billingDetails.mobile:", typeof orderData.billingDetails.mobile);
        console.log("typeof billingDetails.address:", typeof orderData.billingDetails.address);
        console.log("typeof billingDetails.country:", typeof orderData.billingDetails.country);

        const createdOrder = await Order.create(orderData);

        // Customer Order Confirmation Email (already implemented - keep this)
        const emailSubject = `Order Confirmation - Order #${createdOrder._id}`;
        const emailHTML = orderConfirmationEmailTemplate(createdOrder);
        const customerEmailSent = await sendTestEmail(createdOrder.billingDetails.email, emailSubject, emailHTML);
        // ... (customer email sending success/error logging) ...


        // **ADMIN ORDER NOTIFICATION EMAIL - ADD THIS SECTION**
        const adminEmailSubject = `⚠️ New Order Notification - Order #${createdOrder._id}`;
        const adminEmailHTML = adminOrderNotificationEmailTemplate(createdOrder); 
        const adminEmailSent = await sendTestEmail(ADMIN_EMAIL_ADDRESS, adminEmailSubject, adminEmailHTML); 

        if (adminEmailSent) {
            console.log(`Admin notification email sent successfully for order ID: ${createdOrder._id} to ${ADMIN_EMAIL_ADDRESS}`);
        } else {
            console.error(`Error sending admin notification email for order ID: ${createdOrder._id} to ${ADMIN_EMAIL_ADDRESS}`);
            // **Handle admin email sending failure as needed.**
        }

        res.status(201).json({ message: "Order created successfully", order: createdOrder });

    } catch (error) {
        console.error("Error creating order:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Order validation failed", errors: error.errors });
        } else {
            res.status(500).json({ message: "Failed to create order", error: error.message });
        }
    }
};


// **NEW function: confirmPayment**
export const confirmPayment = async (req, res) => {
    const { id: orderId } = req.params; 
    const { transactionId, paymentMethodName } = req.body; 

    try {
        const order = await Order.findById(orderId); // Find the order by ID

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === 'Confirmed') { // Optional: Prevent double confirmation
            return res.status(400).json({ message: "Payment already confirmed for this order." });
        }

        order.paymentStatus = 'Confirmed'; // Update paymentStatus
        order.orderStatus = 'Processing'; // Update orderStatus to 'Processing' after payment
        order.transactionId = transactionId; // Store transactionId
        order.paymentMethod = paymentMethodName; // Store paymentMethodName (optional, if you want to record this again)

        await order.save(); // Save the updated order

        // Customer Payment Confirmation Email (already implemented - keep this)
    const emailSubject = `Payment Confirmation & Order Update - Order #${order._id}`;
    const emailHTML = orderConfirmationEmailTemplate(order);
    const customerEmailSent = await sendTestEmail(order.billingDetails.email, emailSubject, emailHTML);
    // ... (customer email sending success/error logging) ...


    // **ADMIN ORDER NOTIFICATION EMAIL - ADD THIS SECTION (similar to createOrder)**
    const adminEmailSubject = `⚠️ New Order Notification - Order #${order._id} - Online Payment`; // Subject for online payment admin notification
    const adminEmailHTML = adminOrderNotificationEmailTemplate(order); // Use admin template
    const adminEmailSent = await sendTestEmail(ADMIN_EMAIL_ADDRESS, adminEmailSubject, adminEmailHTML); // Send to admin

    if (adminEmailSent) {
        console.log(`Admin notification email sent successfully for order ID: ${order._id} (Online Payment) to ${ADMIN_EMAIL_ADDRESS}`);
    } else {
        console.error(`Error sending admin notification email for order ID: ${order._id} (Online Payment) to ${ADMIN_EMAIL_ADDRESS}`);
        // **Handle admin email sending failure as needed.**
    }

        res.status(200).json({ message: "Payment confirmed successfully!", order: order }); // Send success response
        console.log(`Payment confirmed for order ID: ${orderId}, Transaction ID: ${transactionId}, Payment Method: ${paymentMethodName}`);


    } catch (error) {
        console.error("Error confirming payment:", error);
        res.status(500).json({ message: "Error confirming payment", error: error.message }); // Send error response
    }
};



// **NEW function: initiatePaymentOrder**
export const initiatePaymentOrder = async (req, res) => {
    try {
        const { orderItems, billingDetails, paymentMethod, orderTotal } = req.body;

        const order = new Order({
            orderItems: orderItems,
            billingDetails: billingDetails,
            paymentMethod: paymentMethod,
            orderTotal: orderTotal,
            paymentStatus: 'Pending', 
            orderStatus: 'Pending' // **FIX: Changed to 'Pending' (valid enum value)** 
        });

        const savedOrder = await order.save();

        res.status(201).json({ message: "Initial order created successfully", order: savedOrder });

    } catch (error) {
        console.error("Error creating initial order:", error);
        res.status(500).json({ message: "Error creating initial order", error: error.message });
    }
};



// Get all orders (for admin dashboard - optional for now)

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('orderItems.product', 'name price'); // **Corrected path: 'orderItems.product'**
        res.status(200).json(orders); // Send orders as JSON response
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
};



// ... (getAllOrders, getOrderById controllers) ...

export const updateOrderStatus = async (req, res) => {
    const orderId = req.params.id; // Get order ID from URL parameters
    const newStatus = req.body.orderStatus; // Get new status from request body

    if (!orderStatusOptions.includes(newStatus)) { // Validate newStatus against allowed options
        return res.status(400).json({ message: "Invalid order status value." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: newStatus },
            { new: true, runValidators: true } // options: new:true - return updated doc, runValidators: ensure schema validations are run
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ success: true, message: "Order status updated successfully", order: updatedOrder }); // Success response with updated order
        console.log(`Order ${orderId} status updated to ${newStatus}`);

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
};

// Get order by ID (for order details page - optional for now)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('orderItems.product', 'name price imageUrl');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Server error fetching order', error: error.message });
    }
};