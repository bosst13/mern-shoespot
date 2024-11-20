const express = require('express');
const authController = require('../controllers/AuthController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/updateUser', protect, authController.updateUser);
router.put('/updateUser', protect, authController.updateUser); // Add this line to support PUT requests
router.post('/resetPassword', authController.resetPassword);

module.exports = router;