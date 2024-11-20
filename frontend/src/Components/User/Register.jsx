// src/Components/User/Register.jsx
import React, { useState } from 'react';
import { Card, TextField, Button, Typography, Alert, CircularProgress, Avatar, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useSignup } from "../../hooks/UserSignup";
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const { loading, error, registerUser } = useSignup();
    const navigate = useNavigate();
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleRegister = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values = {
            name: data.get('name'),
            email: data.get('email').trim().toLowerCase(),
            password: data.get('password'),
            avatar: data.get('avatar')
        };
        console.log("Form Values before processing:", values);
        console.log("Processed Form Values:", values);

        const success = await registerUser(values);
        if (success) {
            navigate("/login");
        }
    };

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Create an Account
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleRegister} autoComplete='off'>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    type="email"
                    label="Email"
                    name="email"
                    required
                />
                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Password"
                    name="password"
                    required
                />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <Avatar
                        src={avatarPreview}
                        sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <input
                        accept="image/*"
                        id="avatar-upload"
                        type="file"
                        name="avatar"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                    />
                    <label htmlFor="avatar-upload">
                        <IconButton color="primary" component="span">
                            <PhotoCamera />
                        </IconButton>
                    </label>
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Register'}
                </Button>
            </form>

            <Typography align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                    Login here
                </Link>
            </Typography>
        </Card>
    );
};

export default Register;