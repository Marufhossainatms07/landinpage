import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.paymentMethod === 'COD') {
        await axios.post('/api/orders', {
          ...formData,
          productId
        });
        navigate('/order-success');
      } else {
        navigate('/payment', { state: { ...formData, productId } });
      }
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">{product.name}</h2>
          <p className="text-lg">Price: ৳{product.price}</p>
          <p className="mt-4">{product.description}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input input-bordered w-full"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              required
            />
            <textarea
              placeholder="Shipping Address"
              className="textarea textarea-bordered w-full"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
              required
            />
            <select
              className="select select-bordered w-full"
              value={formData.paymentMethod}
              onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="PayNow">Pay Now</option>
            </select>
            <button type="submit" className="btn btn-primary w-full">
              {formData.paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;