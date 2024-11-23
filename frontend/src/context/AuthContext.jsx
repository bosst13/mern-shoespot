import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { auth, googleProvider, db } from '../firebaseConfig';
import { onAuthStateChanged,
    signInWithPopup, 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword, 
    signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                console.log('AuthContext: Current User UID:', currentUser.uid);
    
                try {
                    const token = await currentUser.getIdToken();
                    setToken(token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
                    const response = await axios.get(`http://localhost:5000/api/auth/me`);
                    const userData = response.data;
    
                    // Log userData for debugging
                    console.log('AuthContext: Fetched User Data from MongoDB:', userData);
    
                    // Update user context with role
                    setUser({ ...userData }); // This ensures role and other user data is properly set
                } catch (error) {
                    console.error('AuthContext: Error fetching user data:', error);
                }
            } else {
                console.log('AuthContext: No user is logged in');
                setToken(null);
                setUser(null);
                delete axios.defaults.headers.common['Authorization'];
            }
        });
    
        return () => unsubscribe();
    }, []);
    

    const reloadUser = async () => {
        if (!auth.currentUser) {
            console.error("No user is currently logged in.");
            throw new Error("User not logged in. Please log in again.");
        }

        await auth.currentUser.reload(); // Refreshes the current user's state
        return auth.currentUser;
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const currentUser = userCredential.user;
    
            const token = await currentUser.getIdToken();
            const response = await axios.get(`http://localhost:5000/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Access the nested user object
            const userData = response.data.user;
            console.log('Full user data from MongoDB:', userData);
    
            // Extract and normalize the role
            const role = userData.role?.trim().toLowerCase();
            console.log('Resolved role:', role);
    
            if (!['user', 'admin'].includes(role)) {
                console.error('Invalid role:', role);
                throw new Error('Invalid role. Access denied.');
            }
    
            // Update context and local storage
            setToken(token);
            setUser({ ...userData, role });
            localStorage.setItem('token', token);
    
            return role; // Return the role for navigation
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    };
    
    
    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
    
            if (!user.emailVerified) {
                await signOut(auth);
                alert('Please verify your email before logging in.');
                return;
            }
    
            const token = await user.getIdToken();
    
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                const response = await fetch(user.photoURL);
                const blob = await response.blob();
    
                const formData = new FormData();
                formData.append('image', blob, 'avatar.jpg');
    
                const uploadResponse = await fetch('http://localhost:5000/api/auth/upload-avatar', {
                    method: 'POST',
                    body: formData
                });
    
                if (!uploadResponse.ok) {
                    if (uploadResponse.status === 500) {
                        throw new Error('Internal Server Error');
                    } else {
                        const errorData = await uploadResponse.json();
                        throw new Error(errorData.message || 'Failed to upload avatar');
                    }
                }
    
                const data = await uploadResponse.json();
                const avatarURL = data.secure_url;
    
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                    username: user.displayName,
                    avatarURL: avatarURL,
                    createdAt: new Date(),
                    status: user.emailVerified ? 'verified' : 'unverified'
                });
            }
    
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token); // Store token in local storage
        } catch (error) {
            console.error("Error logging in with Google: ", error);
            alert(error.message);
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            let avatarURL = user.photoURL;

            if (updatedData.file) {
                const formData = new FormData();
                formData.append('image', updatedData.file);

                const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    if (response.status === 500) {
                        throw new Error('Internal Server Error');
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Failed to upload avatar');
                    }
                }

                const data = await response.json();
                avatarURL = data.secure_url;
            }

            const userRef = doc(db, 'users', user.uid);
            const { file, ...dataWithoutFile } = updatedData; // Exclude the file field
            await setDoc(userRef, {
                ...dataWithoutFile,
                avatarURL,
            }, { merge: true });

            setUser((prevUser) => ({ ...prevUser, ...dataWithoutFile, photoURL: avatarURL }));
        } catch (error) {
            alert('Failed to update profile: ' + error.message);
        }
    };

    const registerWithEmail = async (email, password, name, avatarFile = null) => {
        try {
            // Step 1: Check if the email already exists in MongoDB using the backend API
            const existingUserResponse = await fetch(`http://localhost:5000/api/auth/check-email/${email}`);
            const existingUserData = await existingUserResponse.json();
    
            if (existingUserData.exists) {
                // If the email exists, delete the existing user in Firebase
                await fetch(`http://localhost:5000/api/auth/delete-user/${email}`, {
                    method: 'DELETE',
                });
                console.log(`User with email ${email} deleted from Firebase.`);
            }
    
            // Step 2: Create the user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Step 3: Send email verification
            await sendEmailVerification(user);
            alert('A verification email has been sent. Please verify your email before proceeding!');
    
            // Step 4: Handle avatar upload (if provided)
            let avatarURL = '';
            let cloudinaryId = '';
            if (avatarFile) {
                const formData = new FormData();
                formData.append('image', avatarFile);
    
                const uploadResponse = await fetch('http://localhost:5000/api/auth/upload-avatar', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.message || 'Failed to upload avatar');
                }
    
                const data = await uploadResponse.json();
                avatarURL = data.secure_url;
                cloudinaryId = data.public_id; // Assuming the API returns the Cloudinary public ID
            } else {
                avatarURL = 'https://default-avatar-url.com/avatar.png'; // Default avatar
            }
    
            // Step 5: Prepare user details for Firestore and MongoDB
            const userDetails = {
                name: name,
                email: user.email,
                password: password, // MongoDB requires a password field; consider hashing it here.
                firebaseUid: user.uid,
                role: 'user', // Default role
                status: 'active', // Default status in MongoDB
                userImage: avatarURL, // Avatar URL
                cloudinary_id: cloudinaryId, // Cloudinary public ID
            };
    
            // Step 6: Save user details to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: userDetails.name,
                email: userDetails.email,
                avatarURL: userDetails.userImage,
                role: userDetails.role,
                createdAt: new Date(),
                status: 'unverified', // Firestore status is initially "unverified"
            });
            console.log('User saved to Firestore.');
    
            // Step 7: Save user details to MongoDB using the backend API
            const mongoResponse = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });
    
            if (!mongoResponse.ok) {
                const mongoError = await mongoResponse.json();
                throw new Error(mongoError.message || 'Failed to save user to MongoDB');
            }
            console.log('User saved to MongoDB.');
    
            // Step 8: Sign out the user to enforce email verification
            await signOut(auth);
    
            return 'Account created successfully! Please verify your email before logging in.';
        } catch (error) {
            console.error('Error registering with email:', error.message);
            throw error;
        }
    };

    const updateEmailAddress = async (newEmail) => {
        try {
            await sendEmailVerification(auth.currentUser, { url: window.location.href });

            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { email: newEmail }, { merge: true });

            return 'A verification email has been sent to your new email address. Please verify it before logging in again.';
        } catch (error) {
            return 'Failed to update email: ' + error.message;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error("Error logging out: ", error);
            alert('Failed to log out: ' + error.message);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                handleUpdate,
                login,
                loginWithGoogle,
                logout,
                updateEmailAddress,
                registerWithEmail,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);