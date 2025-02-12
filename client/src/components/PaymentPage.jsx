import { useState } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from 'react-router-dom';

const paymentInstructions = {
    Bkash: [
        "Go to your bKash Mobile Menu by dialing *247#",
        "Choose 'Send Money'",
        "Enter our bKash Agent/Merchant Account Number: [Your Bkash Number]", // Replace with actual Bkash Number
        "Enter the amount",
        "Enter your bKash PIN",
        "Reply with '1' to confirm"
    ],
    Nagad: [
        "Go to your Nagad Mobile Menu by dialing *167#",
        "Choose 'Send Money'",
        "Enter our Nagad Account Number: [Your Nagad Number]", // Replace with actual Nagad Number
        "Enter the amount",
        "Enter your Nagad PIN",
        "Reply to confirm"
    ],
    Rocket: [
        "Go to your Rocket Mobile Menu by dialing *322#",
        "Choose 'Send Money'",
        "Enter our Rocket Account Number: [Your Rocket Number]", // Replace with actual Rocket Number
        "Enter the amount",
        "Enter your Rocket PIN",
        "Reply to confirm"
    ],
    Upay: [
        "Go to your Upay Mobile Menu",
        "Choose 'Send Money'",
        "Enter our Upay Merchant Account Number: [Your Upay Number]", // Replace with actual Upay Number
        "Enter the amount",
        "Enter your Upay PIN",
        "Confirm Payment"
    ],
    'DBBL Bank': [
        "Login to your DBBL Net Banking account",
        "Go to 'Fund Transfer'",
        "Add our bank account as beneficiary:",
        "Account Name: [Your Bank Account Name]", // Replace with actual Bank Account Details
        "Account Number: [Your Bank Account Number]",
        "Bank Name: Dutch Bangla Bank",
        "Branch Name: [Your Bank Branch Name]",
        "Transfer the amount to our account",
        "Confirm the transaction"
    ],
    'City Bank': [
        "Login to your Citytouch Internet Banking",
        "Go to 'Fund Transfer'",
        "Add our bank account as beneficiary:",
        "Account Name: [Your Bank Account Name]", // Replace with actual Bank Account Details
        "Account Number: [Your Bank Account Number]",
        "Bank Name: City Bank Limited",
        "Branch Name: [Your Bank Branch Name]",
        "Transfer the amount to our account",
        "Confirm the transaction"
    ],
    default: ["Please select a payment method to see instructions."]
};

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const cartItems = location.state?.cartItems || [];
    const orderTotal = location.state?.orderTotal || '0.00';
    const [activeTab, setActiveTab] = useState('mobile_banking');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const billingDetails = location.state?.billingDetails;

    console.log("PaymentPage received cartItems from state:", cartItems);
    console.log("PaymentPage received orderTotal from state:", orderTotal);
    console.log("PaymentPage received billingDetails from state:", billingDetails);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSelectedPaymentMethod(null);
    };

    const handlePaymentMethodClick = (methodName, event) => {
        event.preventDefault();
        console.log("Payment Instructions being passed:", paymentInstructions);
        setTimeout(() => { // **ADD setTimeout DELAY**
            navigate(`/checkout/${methodName}`, {
                state: {
                    orderId: location.state.orderId,
                    orderTotal: orderTotal,
                    cartItems: cartItems,
                    paymentMethodName: methodName,
                    paymentInstructions: paymentInstructions,
                    billingDetails: billingDetails
                }
            });
        }, 150); // **50ms delay (you can try different values, like 10ms, 100ms)**
    };
    

    return (
        <div className="container">
            <div className="profile">
                <img src="https://pay.digitalcarebd.com/uploads/logo/65f73fe4d7eec8-80094761-82264936.png" alt="Digital Care bd" />
                <h3>Digital Care bd</h3>
            </div>

            <section className="payment-summary">
                <h2>Order Summary</h2>
                {cartItems.map((item, index) => (
                    <div key={index} className="summary-item">
                        <p>{item.product.name} x {item.quantity} - ${ (item.product.price * item.quantity).toFixed(2) }</p>
                    </div>
                ))}
                <div className="summary-total">
                    <strong>Total: ${orderTotal}</strong>
                </div>
            </section>

            <div className="payment-methods">
                <a
                    href="#mobile_banking"
                    className={activeTab === 'mobile_banking' ? 'active' : ''}
                    onClick={() => handleTabChange('mobile_banking')}
                >
                    মোবাইল ব্যাংকিং
                </a>
                <a
                    href="#net_banking"
                    className={activeTab === 'net_banking' ? 'active' : ''}
                    onClick={() => handleTabChange('net_banking')}
                >
                    ব্যাংক ট্রান্সফার
                </a>
            </div>

            <div className="payment-options">
                <div id="mobile_banking" className={activeTab === 'mobile_banking' ? 'active' : ''}>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('Bkash', event)}>
                        <img src="https://pay.digitalcarebd.com/assets/template/images/bkash.png" alt="bKash" />
                    </a>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('Nagad', event)}>
                        <img src="https://pay.digitalcarebd.com/assets/template/images/nagad.png" alt="Nagad" />
                    </a>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('Rocket', event)}>
                        <img src="https://pay.digitalcarebd.com/assets/template/images/rocket.png" alt="Rocket" />
                    </a>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('Upay', event)}>
                        <img src="https://pay.digitalcarebd.com/assets/template/images/cellfin.png" alt="Upay" />
                    </a>
                </div>
                <div id="net_banking" className={activeTab === 'net_banking' ? 'active' : ''}>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('DBBL Bank', event)}>
                        <img src="https://pay.digitalcarebd.com/uploads/bank_logo/dbbl.png" alt="Dutch Bangla Bank" />
                    </a>
                    <a href="#" onClick={(event) => handlePaymentMethodClick('City Bank', event)}>
                        <img src="https://pay.digitalcarebd.com/uploads/bank_logo/65f73e77d10289-15211517-82315199.png" alt="City Bank Limited" />
                    </a>
                </div>
            </div>
        </div>
    );
}