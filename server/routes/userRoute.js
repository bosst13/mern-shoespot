import express from 'express';
import {loginUser, registerUser, allUsers, getUserDetails, updateUser } from '../controller/authController.js';
// import upload from '../config/multer.js';
import multer from 'multer';

const route = express.Router();
const upload = multer({ dest: 'uploads/' });
// .single('avatar'); 
route.post('/register', upload.single('avatar'), registerUser);
route.post('/login', loginUser);
// route.post('/user', create);

//admin routes
route.get('/users', allUsers);
route.get('/user/:id', getUserDetails);
route.put('/update/user/:id', updateUser);
// route.delete('/delete/user/:id', deleteUser);
// route.patch('/toggle/userStatus/:id', toggleUserStatus);

export default route;