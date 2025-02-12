// client/src/pages/OrderSuccess.jsx
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
    const navigate = useNavigate();
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">We have received your payment and will process your order shortly.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  };

  export default OrderSuccess;