import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PaymentGateways from "../components/PaymentGateways";

const PaymentPage = () => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { productId, ...formData } = location.state || {};

  useEffect(() => {
    axios
      .get("/api/payment-gateways")
      .then((res) => setGateways(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGateway) {
      alert("Please select a payment gateway");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("paymentProof", paymentProof);
    formDataObj.append("gatewayId", selectedGateway._id);
    formDataObj.append("productId", productId);
    formDataObj.append("name", formData.name);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("address", formData.address);

    try {
      await axios.post("/api/orders", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/order-success");
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-primary">Complete Payment</h2>
        <PaymentGateways
          gateways={gateways}
          selectedGateway={selectedGateway}
          onSelect={setSelectedGateway}
        />
        {selectedGateway && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Payment Instructions:</h3>
            <p className="text-sm mb-4">{selectedGateway.instructions}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                className="file-input file-input-bordered w-full"
                accept="image/*"
                required
              />
              <button type="submit" className="btn btn-primary w-full py-2 text-lg">
                Confirm Payment
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;