// routes/paymentGatewayRoutes.js
import express from 'express';
const router = express.Router();

router.get('/payment-gateways', (req, res) => {
  // Sample data - replace with actual database fetch
  const gateways = [
    {
      _id: 1,
      name: "bKash",
      logo: "https://pay.digitalcarebd.com/assets/template/images/bkash.png",
      accountNumber: "0123456789",
      instructions: "Send money to this number and upload screenshot"
    },
    // Add other gateways similarly
  ];
  res.json(gateways);
});

export default router;