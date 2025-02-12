// server/models/orderModel.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to your Product model
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    billingDetails: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, required: true },
        mobile: { type: String, required: true }, // Or Number if you prefer
        email: { type: String, required: true },
        orderNotes: { type: String } // Optional
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'PayNow', 'Bkash', 'Nagad', 'Rocket', 'Upay', 'DBBL Bank', 'City Bank'], // **ENUM VALIDATOR HERE**
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], // **ENUM VALIDATOR HERE**
        default: 'Pending' 
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Failed'],
        default: 'Pending'
    },

    // You can add more fields like user information (if users are logged in), tracking number, etc.
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

const Order = mongoose.model('Order', orderSchema);

export default Order;