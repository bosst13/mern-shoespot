const upload = require('../utils/multer');
const { admin, db } = require('../utils/firebaseConfig');
const User = require('../models/UserModel.js');
const cloudinary = require('../utils/cloudinary');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { name, email, password, firebaseUid, role, status, userImage, cloudinary_id } = req.body;
    const imageFile = req.file;

    try {
      // Hash the password before saving to MongoDB
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user document
      const newUser = new User({
          name,
          email,
          password: hashedPassword, // Save the hashed password
          firebaseUid,
          role: role || 'user',
          status: status || 'active',
          userImage,
          cloudinary_id,
      });

      await newUser.save();
      res.status(201).json({ message: 'User registered successfully in MongoDB.' });
  } catch (error) {
      console.error('Error saving user to MongoDB:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Controller function to handle user login
exports.checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Check if user exists in Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email.trim().toLowerCase());
    return res.status(200).json({ exists: true, uid: userRecord.uid });
  } catch (error) {
    // If the user doesn't exist in Firebase, return false
    if (error.code === 'auth/user-not-found') {
      return res.status(200).json({ exists: false });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { email } = req.params;

  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email.trim().toLowerCase());
    
    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(userRecord.uid);

    return res.status(200).json({ message: `User with email ${email} deleted successfully` });
  } catch (error) {
    // Handle errors (user not found or other issues)
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { email, password, name } = req.body;
  const userId = req.user.uid; // Assuming user ID is available in req.user
  try {
    // Update user details in Firebase Authentication
    const userRecord = await admin.auth().updateUser(userId, {
      email,
      password,
      displayName: name,
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

exports.uploadAvatar = [
  upload.single('image'),
  async (req, res) => {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    try {
      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, { folder: 'user_images' });
      const imageUrl = uploadResponse.secure_url;

      res.status(201).json({ message: 'Image uploaded successfully', secure_url: imageUrl });
    } catch (error) {
      console.error("Error during image upload:", error.message);
      res.status(400).json({ message: error.message });
    }
  }
];

exports.getCurrentUser = async (req, res) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Received token:", token);  // Log received token

    // Verify the Firebase custom token
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded token:", decodedToken);  // Log decoded token

    const userId = decodedToken.uid;  // Get user ID from token

    // Fetch the user from Firestore by UID
    const userDoc = await db.collection('users').doc(userId).get();

    // Log the document retrieval result
    console.log("Firestore document data:", userDoc.exists ? userDoc.data() : 'No such document found');

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    // Get the user data from the document
    const user = userDoc.data();

    // Respond with user details
    res.status(200).json({
      message: 'User retrieved successfully',
      user: {
        name: user.name,
        email: user.email,
        status: user.status,  // Assuming status is a field in your user document
        avatarURL: user.avatarURL,  // Assuming avatarURL is a field in your user document
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach the decoded user to the request
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error.message);
    return res.status(403).json({ message: 'Failed to verify token', error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  const { uid } = req.user;

  try {
      // Fetch from Firestore
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
          console.error('Firestore: No such document for UID:', uid);
          return res.status(404).json({ message: 'User not found in Firestore.' });
      }
      const firestoreData = userDoc.data();
      console.log('Fetched Firestore data:', firestoreData);

      // Fetch from MongoDB
      const mongoUser = await User.findOne({ firebaseUid: uid });
      if (!mongoUser) {
          console.error('MongoDB: No user found for UID:', uid);
          return res.status(404).json({ message: 'User not found in MongoDB.' });
      }
      console.log('Fetched MongoDB data:', mongoUser);

      // Combine the data
      const userData = {
          ...firestoreData,
          ...mongoUser.toObject(),
      };

      res.status(200).json({ user: userData });
  } catch (error) {
      console.error('Error fetching user data:', error.message);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate the user using Firebase Authentication (get user details from Firebase)
    const userRecord = await admin.auth().getUserByEmail(email);

    // Fetch the user's information from Firestore using the Firebase UID
    const userDoc = await db.collection('users').doc(userRecord.uid).get();

    // Check if the user document exists
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    const user = userDoc.data();

    // Send the user information along with a success message
    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        username: user.username,
        email: user.email,
        status: user.status,  // Assuming status is a field in your user document
        avatarURL: user.avatarURL,  // Assuming avatarURL is a field in your user document
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Login failed' });
  }
};