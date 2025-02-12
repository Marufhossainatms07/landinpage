// server/models/PaymentGateway.js
import mongoose from 'mongoose';

const paymentGatewaySchema = new mongoose.Schema({
    name: String,
    type: String,
    accountNumber: String,
    instructions: String,
    logo: String
  });

  export default paymentGatewaySchema;