import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "COD",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "PayNow") {
      navigate("/payment", { state: { ...formData, productId } });
    } else {
      try {
        await axios.post("/api/orders", { ...formData, productId });
        navigate("/order-success");
      } catch (err) {
        console.error("Error placing order:", err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>
      <input
        type="text"
        placeholder="Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input input-bordered w-full mb-4"
      />
      <input
        type="tel"
        placeholder="Phone"
        required
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="input input-bordered w-full mb-4"
      />
      <textarea
        placeholder="Address"
        required
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="textarea textarea-bordered w-full mb-4"
      />
      <select
        value={formData.paymentMethod}
        onChange={(e) =>
          setFormData({ ...formData, paymentMethod: e.target.value })
        }
        className="select select-bordered w-full mb-4"
      >
        <option value="COD">Cash on Delivery</option>
        <option value="PayNow">Pay Now</option>
      </select>
      <button type="submit" className="btn btn-primary w-full">
        {formData.paymentMethod === "COD"
          ? "Place Order"
          : "Proceed to Payment"}
      </button>
    </form>
  );
};

export default CheckoutForm;
