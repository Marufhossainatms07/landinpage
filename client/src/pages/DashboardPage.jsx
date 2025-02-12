import { useState, useEffect } from 'react';
import './DashboardPage.css';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const DashboardPage = () => {
    const [overviewStats, setOverviewStats] = useState(null); // To store overview data from API
    const [loadingStats, setLoadingStats] = useState(true);   // Loading state for overview stats
    const [errorStats, setErrorStats] = useState(null);     // Error state for overview stats


    useEffect(() => {
        const fetchOverviewStats = async () => {
            setLoadingStats(true); // Start loading
            setErrorStats(null);   // Clear any previous errors
            try {
                const response = await axios.get('/api/dashboard/overview-stats'); // Backend API endpoint
                setOverviewStats(response.data); // Store fetched data in state
                setLoadingStats(false); // Loading complete (success)
                console.log("Fetched dashboard overview stats:", response.data); // Log success
            } catch (error) {
                console.error("Error fetching dashboard overview stats:", error); // Log error
                setErrorStats(error); // Set error state
                setLoadingStats(false); // Loading complete (error)
            }
        };
    
        fetchOverviewStats(); // Call the fetch function when component mounts
    }, []); // Empty dependency array means this useEffect runs only once on mount


    return (
        <div className="dashboard-page-container">
            <h1>Admin Dashboard</h1>
            <section className="dashboard-section overview-section">
                <h2>Overview</h2>
                {loadingStats ? (
                    <LoadingSpinner message="Loading dashboard statistics..." /> 
                ) : errorStats ? (
                    <p className="error-message">Error loading dashboard statistics: {errorStats.message}</p>
                ) : overviewStats ? ( // Only render summary cards if overviewStats is not null (data fetched successfully)
                    <div className="overview-summary-cards">
                        <div className="summary-card orders-card">
                            <h3>Total Orders</h3>
                            <p>[Total Orders Count]</p>  {/* Placeholder */}
                        </div>
                        <div className="summary-card sales-card">
                            <h3>Total Sales</h3>
                            <p>[Total Sales Amount]</p> {/* Placeholder */}
                        </div>
                        <div className="summary-card new-customers-card">
                            <h3>New Customers (This Month)</h3>
                            <p>[New Customers Count]</p> {/* Placeholder */}
                        </div>
                        <div className="summary-card out-of-stock-card">
                            <h3>Products Out of Stock</h3>
                            <p>[Products Out of Stock Count]</p> {/* Placeholder */}
                        </div>
                    </div>
                ) : (
                    <p>Could not load dashboard statistics.</p> // Fallback message if data is null but no error
                )}
            </section>

            <section className="dashboard-section recent-orders-section">
                <h2>Recent Orders</h2>
                <p>List of recent orders will be shown here.</p>
                {/* ... Recent Orders table/list ... */}
            </section>

            {/* (Optional - for later) 
            <section className="dashboard-section sales-chart-section">
                <h2>Sales Performance</h2>
                <p>Sales chart will be displayed here.</p>

            </section> 
            */}
        </div>
    );
};

export default DashboardPage;