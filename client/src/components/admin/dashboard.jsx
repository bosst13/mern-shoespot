import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="row" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to ShoeSpot!</h1>
            <p>You have successfully logged in as Admin.</p>
            <p>This is the Dashboard</p>
            {/* <div className="col-12 col-md-2">
                <Link to="/sidebar" className="btn btn-primary">Sidebar</Link> 
            </div> */}
            {/* <div className="col-12 col-md-10"> 
                <div className="card-body">
                    <Link to="/users" className="btn btn-primary">Users</Link>
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
