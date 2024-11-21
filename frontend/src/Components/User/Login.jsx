import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import registerImage from "../../assets/register.png";
import { Box, Card, Typography, TextField, Button, Alert, CircularProgress, InputAdornment } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from "../../context/AuthContext";
import '../../../src/Auth.css';

const Login = () => {
    const { loading, login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [alert, setAlert] = useState({ type: '', message: '' });

    // Yup validation schema
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('The input is not valid email!').required('Please input your Email!'),
        password: Yup.string().required('Please input your Password!'),
    });

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(LoginSchema)
    });

    useEffect(() => {
        if (loading) {
            const timer = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
            }, 800);
            return () => {
                clearInterval(timer);
            };
        }
    }, [loading]);
    
    const onSubmit = async (values) => {
        console.log("Received values of form: ", values);
        try {
            await login(values.email, values.password);
            setAlert({ type: 'success', message: 'Login successful!' });
            navigate("/"); // Redirect to dashboard after successful login
        } catch (err) {
            setAlert({ type: 'error', message: err.message });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            setAlert({ type: 'success', message: 'Google login successful!' });
            navigate("/"); // Redirect to dashboard after successful login
        } catch (error) {
            setAlert({ type: 'error', message: 'Google login failed. Please try again.' });
            console.error("Google login failed", error);
        }
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3 }}>
            <Box className="flex-container">
            <div className="image-content">
                    <img src={registerImage} className="auth-loginimage" alt="Register" />
                </div>
                <Box className="form-content">
                    <Typography variant="h3" component="h1" className="title">
                        Sign In
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                        <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
                            />
                            )}
                        />
                        </div>

                        <div>
                        <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                            <TextField
                                {...field}
                                label="Password"
                                fullWidth
                                margin="normal"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                            />
                            )}
                        />
                        </div>

                        {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>}
                    
                        <div>
                            {loading ? (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgressWithLabel value={progress} />
                                </Box>
                            ) : (
                                <Button type="primary" htmlType="submit" size="large" className="btn" disabled={isSubmitting || loading}>
                                    Sign In
                                </Button>
                            )}
                        </div>

                        <div>
                            <Button type="default" size="large" className="btn" onClick={handleGoogleLogin}>
                                Sign In with Google
                            </Button>
                        </div>

                        <div>
                            <Link to="/register" className="link">
                                <Button variant="contained" size="large" className="btn">
                                    Create Account
                                </Button>
                            </Link> 
                        </div>
                    </form>
                </Box>
            </Box>
        </Card>
    );
};

export default Login;