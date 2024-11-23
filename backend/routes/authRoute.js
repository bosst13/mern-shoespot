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
router.get('/me', auth, getCurrentUser, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User role from MongoDB:', user.role); // Debug user role

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});
router.get('/check-email/:email', checkEmail);  // To check if email exists
router.delete('/delete-user/:email', deleteUser);  // To delete user by email

module.exports = router;