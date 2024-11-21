const { admin, db } = require('../utils/firebaseConfig');
const createError = require('../utils/error');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new createError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];
  console.log('Received token:', token); // Log the token for debugging

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded token:', decodedToken); // Log the decoded token for debugging
    req.user = decodedToken; // Attach the decoded user to the request

    // Fetch the user from the database using the decoded token's UID
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return next(new createError(401, 'The user belonging to this token does no longer exist.'));
    }

    const currentUser = userDoc.data();
    console.log('Authenticated user:', currentUser); // Log the current user for debugging

    req.user = currentUser; // Attach the user to the request
    next();
  } catch (error) {
    console.error('Error verifying ID token:', error.message);
    return next(new createError(403, 'Failed to verify token', { cause: error.message }));
  }
};

module.exports = auth;