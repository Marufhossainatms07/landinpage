// server/adminOrderNotificationEmailTemplate.js
const adminOrderNotificationEmailTemplate = (order) => {
    const orderItemsSummary = order.orderItems.map(item => `${item.product.name} x ${item.quantity}`).join(', ');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Order Notification - Order #${order._id}</title>
        </head>
        <body>
            <h1>⚠️ New Order Placed! ⚠️</h1>

            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> <strong>${order._id}</strong></p>
            <p><strong>Order Date & Time:</strong> ${order.orderDate}</p>
            <p><strong>Customer Name:</strong> ${order.billingDetails.name}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Order Total:</strong> ${order.orderTotal}</p>

            <h3>Items Ordered (Summary):</h3>
            <p>${orderItemsSummary}</p>  

            <hr>
            <p style="font-size: small; color: #777;">This is an automatically generated order notification for administrators.</p>
        </body>
        </html>
    `;
};

export default adminOrderNotificationEmailTemplate;