// server/orderConfirmationEmailTemplate.js
const orderConfirmationEmailTemplate = (order) => {
    const orderItemsHTML = order.orderItems.map(item => `
        <tr>
            <td><span class="math-inline">\{item\.product\.name\}</td\>
            <td>{item.quantity}</td>
            <td>item.product.price</td>
            <td>{(item.product.price * item.quantity).toFixed(2)}</td>
        </tr>`).join(''); // Join array of HTML strings into a single string
        return `
    <!DOCTYPE html>
        <html>
            <head>
                <title>Order Confirmation - Order #${order._id}</title>
            </head>
            <body>
                <h1>Thank you for your order!</h1>
                <p>Dear <span class="math-inline">\{order\.billingDetails\.name\},</p\>
            <p>This email confirms that we have received your order (Order # <strong>{order._id}</strong>) placed on <strong>${order.orderDate}</strong>.</p>

                <h2>Order Summary</h2>
                <table border="1" cellpadding="5">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Item Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <span class="math-inline">\{orderItemsHTML\}
            </tbody>
            <tfoot>
            <tr>
            <td colspan="3" align="right"><strong>Order Total:</strong></td>
            <td><strong>{order.orderTotal}</strong></td>
            </tr>
            </tfoot>
            </table>
                <h2>Billing Details</h2>
                <p><strong>Name:</strong> ${order.billingDetails.name}</p>
                <p><strong>Email:</strong> ${order.billingDetails.email}</p>
                <p><strong>Mobile:</strong> ${order.billingDetails.mobile}</p>
                <p><strong>Address:</strong> ${order.billingDetails.address}, ${order.billingDetails.country}</p>
                <p><strong>Order Notes:</strong> ${order.billingDetails.orderNotes || 'N/A'}</p> 

                <h2>Payment Information</h2>
                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> ${order.paymentStatus}</p> 

                <p><strong>Order Status:</strong> ${order.orderStatus}</p>

                <p>We are now processing your order and will notify you when it is shipped.</p>
                <p>Thank you for shopping with us!</p>

                <hr>
                <p style="font-size: small; color: #777;">This is an automatically generated order confirmation email. Please do not reply to this email.</p>
            </body>
        </html>`;
    };

export default orderConfirmationEmailTemplate;