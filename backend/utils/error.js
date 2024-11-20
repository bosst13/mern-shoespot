const upload = require('../utils/multer');
const { admin, db } = require('../utils/firebaseConfig');
const User = require('../models/UserModel.js');
const cloudinary = require('../utils/cloudinary');

exports.signup = [
  upload.single('image'),
  async (req, res) => {
    const { email, password, username } = req.body;
    const imageFile = req.file;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password, and username are required.' });
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'The email address is improperly formatted.' });
    }

    try {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'The email address is already in use by another account.' });
      }

      const existingFirebaseUser = await admin.auth().getUserByEmail(email.trim().toLowerCase());
      if (existingFirebaseUser) {
        return res.status(400).json({ message: 'The email address is already in use by another account.' });
      }
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        return res.status(400).json({ message: error.message });
      }
    }

    try {
      const userRecord = await admin.auth().createUser({
        email: email.trim().toLowerCase(),
        password,
        displayName: username,
      });

      const emailVerificationLink = await admin.auth().generateEmailVerificationLink(email.trim().toLowerCase());

      let imageUrl = '';
      if (imageFile) {
        const uploadResponse = await cloudinary.uploader.upload(imageFile.path, { folder: 'user_images' });
        imageUrl = uploadResponse.secure_url;
      }

      const newUser = new User({
        email: email.trim().toLowerCase(),
        username,
        firebaseUid: userRecord.uid,
        imageUrl,
      });
      await newUser.save();

      await db.collection('users').doc(userRecord.uid).set({
        email: email.trim().toLowerCase(),
        username,
        firebaseUid: userRecord.uid,
        imageUrl,
      });

      res.status(201).json({ message: 'User created successfully. Please verify your email.', user: userRecord, emailVerificationLink });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
];

// Controller function to handle user login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Firebase Authentication Client SDK should handle password verification on the client side.
    // Here, we assume the client sends a valid ID token after successful login.
    const userRecord = await admin.auth().getUserByEmail(email);
    // Respond with success message and user details
    res.status(200).json({ message: 'User logged in successfully', user: userRecord });
  } catch (error) {
    // Respond with error message if login fails
    res.status(400).json({ message: error.message });
  }
};

// Controller function to handle user update
exports.updateUser = async (req, res) => {
  const { email, password, username } = req.body;
  const userId = req.user.uid; // Assuming user ID is available in req.user
  try {
    // Update user details in Firebase Authentication
    const userRecord = await admin.auth().updateUser(userId, {
      email,
      password,
      displayName: username,
    });
    // Respond with success message and updated user details
    res.status(200).json({ message: 'User updated successfully', user: userRecord });
  } catch (error) {
    // Respond with error message if user update fails
    res.status(400).json({ message: error.message });
  }
};

// Controller function to handle password reset
exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate a password reset link for the given email
    const link = await admin.auth().generatePasswordResetLink(email);
    // Send the link to the user's email address
    // You can use a service like SendGrid, Mailgun, etc. to send the email
    res.status(200).json({ message: 'Password reset email sent. Please check your inbox.', link });
  } catch (error) {
    // Respond with error message if password reset fails
    res.status(400).json({ message: error.message });
  }
};