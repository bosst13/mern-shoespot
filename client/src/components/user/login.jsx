import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    const location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '/home'; // Set a default redirect

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http:localhost:5173/login', { email, password });
            const { role } = response.data;

            // Navigate based on user role
            if (role === 'user') {
                navigate(redirect || '/home'); // Redirect to user homepage or specified redirect
            } else if (role === 'admin') {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className='form-container'>
            <form className="form" onSubmit={handleLogin}>
                <h3>Login</h3>
                <div className="form-group">
                    <label htmlFor='email'>Email:</label>
                    <input
                        className="form-control"
                        type="email"
                        id='email' // Added id for accessibility
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='password'>Password:</label>
                    <input
                        className="form-control"
                        type="password"
                        id='password' // Added id for accessibility
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Styled error message */}
                <button type="submit" className='btn btn-block py-3'>Login</button><br></br>

                <Link to="/register" className='float-right mt-3'>Don't have an account? Register here</Link>
            </form>
        </div>
    );
};

export default Login;
