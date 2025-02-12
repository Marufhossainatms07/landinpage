import { NavLink } from 'react-router-dom';
import './AdminPanel.css';
import DashboardPage from './AdminDashboard';
import Products from './ProductsPage';
// import AdminProductList from '../components/AdminProductList'; // Import AdminProductList component

const AdminPanel = () => {

    return (
        <div className="admin-panel-container">
            <div className="admin-sidebar">
                <h1>Admin Panel</h1>
                <nav className="admin-navigation">
                    <ul>
                        <NavLink to="/admin/dashboard" activeClassName="active">Dashboard</NavLink>
                        <NavLink to="/admin/orders" activeClassName="active">Orders</NavLink>
                        <NavLink to="/admin/products" activeClassName="active">Products</NavLink>
                        <a href="#" className="nav-link">Payment Gateways</a>
                        <a href="#" className="nav-link">Settings</a>
                    </ul>
                </nav>
            </div>

            <main className="admin-content">
                <DashboardPage /> {/*  DashboardPage is now the *only* content in main */}
                <Products /> {/* Add AdminProductList component */}
            </main>
        </div>
    );
};

export default AdminPanel;

