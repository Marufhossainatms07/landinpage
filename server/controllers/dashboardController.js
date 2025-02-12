// controllers/dashboardController.js

export const getDashboardOverviewStats = async (req, res) => {
    try {
        // ---  In a real application, you would fetch actual data from your database here ---
        // ---  For now, we are sending sample data for testing ---

        const overviewStatsData = {
            totalProducts: 185,
            totalOrders: 2347,
            newOrdersToday: 78,
            revenueLastMonth: 89532
        };

        res.status(200).json(overviewStatsData); // Send sample data with 200 OK status

    } catch (error) {
        console.error("Error fetching dashboard overview stats:", error);
        res.status(500).json({ message: "Error fetching dashboard overview stats" }); // Send error response
    }
};