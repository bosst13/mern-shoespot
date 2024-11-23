import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = ({ allowedRoles }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setLoading(false);
        }
    }, [user]);

    console.log('RequireAuth user:', user);

    // Show a loading indicator until user data is fully loaded
    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if user is not authenticated
    if (!user) {
        console.log('RequireAuth: Redirecting to /login');
        return <Navigate to="/login" />;
    }

    // Check if role matches allowedRoles
    if (!user.role || !allowedRoles.includes(user.role)) {
        console.error('Access denied for role:', user.role);
        return <Navigate to="/unauthorized" />;
    }

    // Allow access to child routes for valid roles
    return <Outlet />;
};
