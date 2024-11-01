import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../App.css";

const Register = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '' });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password', user.password);
        if (avatar) {
            formData.append('avatar', avatar);
        }
    
        register(formData);
    }

    const onChange = (e) => {
        if (e.target.name === 'avatar') {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result);
                        setAvatar(file);
                    }
                };
                reader.readAsDataURL(file);
            }
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    }

    const register = async (userData) => {
        setLoading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('http://localhost:3000/api/register', userData, config);
            console.log("Registered User:", data.user);
            setUser(data.user);
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error); // Log the error for debugging
            setError(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false); // Ensure loading is stopped in both success and error cases
        }
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={submitHandler}>
                <h3>Register</h3>
                <div className='form-group'>
                    <label htmlFor="name">Name</label>
                    <input type="text" 
                    id="name" 
                    className="form-control" 
                    name="name" 
                    value={user.name} 
                    onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor="email">Email</label>
                    <input type="email" 
                    id="email" 
                    className="form-control" 
                    name="email" 
                    value={user.email} 
                    onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <input type="password" 
                    id="password" 
                    className="form-control" 
                    name="password" 
                    value={user.password} 
                    onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor="avatar_upload">Avatar</label>
                    <div className='d-flex align-items-center'>
                        <figure className='avatar mr-3'>
                            <img src={avatarPreview} className='rounded-circle' alt="Avatar Preview" />
                        </figure>
                        <div className='custom-file'>
                            <input type="file" 
                            name="avatar" 
                            className='custom-file-input' 
                            id="customFile" 
                            accept="images/*" 
                            onChange={onChange} />
                            <label className='custom-file-label' htmlFor='customFile'>Choose Avatar</label>
                        </div>
                    </div>
                </div>
                <button id='register-button' type="submit" className='btn btn-block py-3'>
                    Register
                </button>   
                {error && <p className="error-message">{error}</p>}
                <Link to="/login" className='float-right mt-3'>Already have an account? Login here</Link>
            </form>
        </div>
    );
}

export default Register;
