import React from 'react';
import ProductTable from './ProductTable';


    const Dashboard = () => {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the admin dashboard!</p>
                <ProductTable />
            </div>
        );
    };

    export default Dashboard;