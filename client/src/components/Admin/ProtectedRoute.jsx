// src/components/Admin/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
        // টোকেন না থাকলে লগইন পেজে রিডাইরেক্ট করুন
        return <Navigate to="/admin/login" replace />;
    }

    // টোকেন থাকলে চিলড্রেন কম্পোনেন্ট রেন্ডার করুন (যেমন AdminDashboard, AdminProductList)
    return children;
};

export default ProtectedRoute;