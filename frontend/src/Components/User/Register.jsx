import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerImage from '../../assets/register.png';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { UploadOutlined } from '@ant-design/icons';
import { Typography, Upload } from 'antd';
import { AccountCircle } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { Box, LinearProgress, Card, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import '../../../src/Auth.css';

const Register = () => {
    const { registerWithEmail } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const SignupSchema = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Too Short!').required('Required'),
        passwordConfirm: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(SignupSchema)
    });

    const onSubmit = async (values) => {
        console.log("Form Values before processing:", values);
        values.email = values.email.trim().toLowerCase();
        console.log("Processed Form Values:", values);

        try {
            setLoading(true);
            const successMessage = await registerWithEmail(values.email, values.password, values.name, values.image[0].originFileObj);
            setAlert({ type: 'success', message: successMessage });
            setTimeout(() => {
                navigate("/login");
            }, 3000); // Delay navigation by 3 seconds to show the success message
        } catch (error) {
            setAlert({ type: 'error', message: error.message || 'Failed to create account. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 5, p: 3 }}>
            <Box className="form-content">
                <Typography variant="h3" component="h1" className="title" align="center">
                    Registration Form
                    <img src={registerImage} className="auth-image" alt="Register" width={'55'}/>
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                            <label htmlFor="name">Name</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            size="large"
                                            placeholder="Enter your Name"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountCircle />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.name}
                                            helperText={errors.name ? errors.name.message : ''}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            size="large"
                                            placeholder="Enter your Email"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.email}
                                            helperText={errors.email ? errors.email.message : ''}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="password"
                                            size="large"
                                            placeholder="Enter your Password"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.password}
                                            helperText={errors.password ? errors.password.message : ''}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <Controller
                                name="passwordConfirm"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="password"
                                            size="large"
                                            placeholder="Re-enter your Password"
                                            variant="outlined"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            error={!!errors.passwordConfirm}
                                            helperText={errors.passwordConfirm ? errors.passwordConfirm.message : ''}
                                            sx={{ mb: 2 }}
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field }) => (
                                    <Upload
                                        fileList={field.value}
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        onChange={(info) => field.onChange(normFile(info))}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
                                    </Upload>
                                )}
                            />
                        </div>
                        {alert.message && <Alert severity={alert.type}>{alert.message}</Alert>}
                        <div>
                            {loading ? (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            ) : (
                                <Button type="primary" htmlType="submit" size="large" className="btn" disabled={isSubmitting || loading}>
                                    Create Account
                                </Button>
                            )}
                        </div>
                        <div>
                            <Typography variant="body2" align="center" mt={2}>
                                Already have an account? <Link to="/login">Login</Link>
                            </Typography>
                        </div>
                    </form>
                </Box>
            </Card>
    );
};

export default Register;