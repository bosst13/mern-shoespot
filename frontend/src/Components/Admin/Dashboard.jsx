import React, { useState } from 'react';
import Sidebar from '../Layout/Sidebar';
import ProductTable from './ProductTable';
import StatusTable from './StatusTable';
import ChartsTable from './OrdersChart';

const Dashboard = () => {
    const [activeContent, setActiveContent] = useState('dashboard'); // Track the active content
    const [showProductTable, setShowProductTable] = useState(false); // Specific toggle for product table
    const [showStatusTable, setShowStatusTable] = useState(false); // Specific toggle for status table
    const [showChartsTable, setShowChartsTable] = useState(false); // Specific toggle for charts table

    const handleButtonClick = (contentType) => {
        setActiveContent(contentType); // Update active content

        // Manage specific visibility for "Product Table"
        if (contentType === 'products') {
            setShowProductTable(true);
        } else {
            setShowProductTable(false);
        }

        if (contentType === 'orders') {
            setShowStatusTable(true);
        } else {
            setShowStatusTable(false);
        }

        if (contentType === 'charts') {
            setShowChartsTable(true);
        } else {
            setShowChartsTable(false);
        }
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'dashboard':
                return <p>Dashboard!</p>;
            case 'products':
                return <p></p>;
            case 'orders':
                return <p></p>;
            case 'charts':
                return <p></p>;
            default:
                return <p></p>;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar onButtonClick={handleButtonClick} />
        
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the admin dashboard!</p>
                
                {renderContent()}
                {showProductTable && <ProductTable />}
                {renderContent()}
                {showStatusTable && <StatusTable />}
                {renderContent()}
                {showChartsTable && <ChartsTable />}
            </div>
        </div>
    );
};

export default Dashboard;
