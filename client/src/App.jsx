import './index.css';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductDetails from './pages/ProductDetails';
import AdminPanel from "./pages/AdminPanel";
import PaymentPage from './components/PaymentPage'; 
import MethodCheckoutPage from './components/MethodCheckoutPage';
import OrderSuccessPage from './components/OrderSuccessPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute'; 
import AdminAuthPage from './components/Admin/AdminAuthPage'; 



const App = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/dashboard" element={<AdminPanel />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/checkout/:paymentMethodName" element={<MethodCheckoutPage />} /> 
      <Route path="/admin/products" element={<ProductsPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/admin/orders/:orderId" element={<OrderDetailsPage />} />
      <Route path="/admin/orders" element={<OrdersPage />} /> 
      <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/admin" element={<AdminDashboard />} /> 
      <Route path="/admin/login" element={<AdminAuthPage />} />

    </Routes>
  );
};

export default App;