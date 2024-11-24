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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log('RequireAuth: Redirecting to /login');
        return <Navigate to="/login" />;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
        console.error('Access denied for role:', user.role);
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};
