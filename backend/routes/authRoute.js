const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
    login,
    updateUser,
    resetPassword,
    uploadAvatar,
    getCurrentUser,
    signup,
    checkEmail,  
    deleteUser  
} = require('../controllers/AuthController');


router.post('/signup', signup);
router.post('/login', login);
router.patch('/updateUser', auth, updateUser);
router.put('/updateUser', auth, updateUser);
router.post('/resetPassword', resetPassword);
router.post('/upload-avatar', uploadAvatar);
router.get('/me', auth, getCurrentUser);

router.get('/check-email/:email', checkEmail);  // To check if email exists
router.delete('/delete-user/:email', deleteUser);  // To delete user by email

module.exports = router;