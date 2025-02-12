// server/routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, confirmPayment, initiatePaymentOrder } from '../controllers/orderController.js'; 


router.post('/', createOrder); // Route to create a new order
router.get('/', getAllOrders); // Route to get all orders (optional for now, for admin)
router.get('/:id', getOrderById); // Route to get order by ID (optional for now, for order details)
router.put('/:id/status', updateOrderStatus);
router.put('/:id/confirm-payment', confirmPayment); // Route to confirm payment for a specific order
router.post('/initiate-payment-order', initiatePaymentOrder); // POST route for initial order creation
router.post('/confirm-payment', async (req, res) => { // **REMOVE THIS ENTIRE ROUTE - IT'S REDUNDANT AND CONFUSING**
    const paymentConfirmationData = req.body;
    console.log("Received payment confirmation data:", paymentConfirmationData);
    res.status(200).json({ message: "Payment confirmation route REACHED (placeholder - implement actual logic)" });
});

export default router;