import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "../../App.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authenticate, getUser } from '../../util/helper';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useHistory
    let location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    const handleLogin = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post('http://localhost:3000/api/login', { email, password }, config);
            console.log(data);
            
            authenticate(data, () => {
                if (data.user.role === 0) { // Check for admin role (0)
                    console.log("Redirecting to dashboard...");
                    navigate('/dashboard');
                } else if (data.user.role === 1) { // Check for user role (1)
                    console.log("Redirecting to home...");
                    navigate('/');
                } else {
                    console.log("No valid role found for user");
                    navigate('/'); // Default redirect in case of unexpected role value
                }
            });
            
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Invalid email or password", { position: "bottom-right" });
            } else {
                console.error("Error during login:", error);
                toast.error("Server error. Please try again later.", { position: "bottom-right" });
            }
        }
    };
    
    const submitHandler = (e) => {
        e.preventDefault();
        handleLogin(email, password)
    }
    // useEffect(() => {
    //     if (getUser() && redirect === 'shipping' ) {
    //          navigate(`/${redirect}`)
    //     }
    // }, [redirect, navigate])

    return (
        <div className='form-container'>
            <form className="form" 
                            onSubmit={submitHandler}
                            >
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
