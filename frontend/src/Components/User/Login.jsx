import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Card, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import useLogin from "../../hooks/UserLogin";

const Login = () => {
    const { loading, error, loginUser } = useLogin();
    const navigate = useNavigate();

    const handleLogin = async (values) => {
        console.log("Received values of form: ", values);
        const success = await loginUser(values);
        if (success) {
            navigate("/"); // Redirect to dashboard after successful login
        }
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3 }}>
            <Box className="flex-container">
                {/* form */}
                <Box className="form-content">
                    <Typography variant="h3" component="h1" className="title">
                        Sign In
                    </Typography>
                    <Typography variant="h5" component="h3" className="slogan">
                        Step Into Style. Find your Perfect Pair.
                    </Typography>

                    <form onSubmit={handleLogin} autoComplete="off">
                        <Box mb={2}>
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                required
                                placeholder="Enter your Email"
                                type="email"
                            />
                        </Box>

                        <Box mb={2}>
                            <TextField
                                label="Password"
                                name="password"
                                variant="outlined"
                                fullWidth
                                required
                                placeholder="Enter your Password"
                                type="password"
                            />
                        </Box>

                        {error && <Alert severity="error" className="alert">{error}</Alert>}

                        <Box mb={2}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : "Sign In"}
                            </Button>
                        </Box>
                        
                        <Box mb={2}>
                        <Typography align="center" sx={{ mt: 2 }}>
                            Don't have an account?{' '}
                        <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                            Register here
                        </Link>
            </Typography>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Card>
    );
};

export default Login;