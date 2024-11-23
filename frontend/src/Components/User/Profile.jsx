import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Correct import path
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Correct import path
import { CircularProgress, Typography, Button, Card, CardContent, Snackbar, Alert, Box } from '@mui/material'; 
import UpdateProfileForm from './UpdateProfileForm'; // Import the UpdateProfileForm component
import { UploadFile } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { styled } from '@mui/system';
import '../../Auth.css';

const Input = styled('input')({
  display: 'none',
});

const Profile = () => {
  const { user, handleUpdate } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [editing, setEditing] = useState(false); // Add editing state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Add Snackbar state

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false); // Set loading to false after fetching data
        }
      } else {
        setLoading(false); // Set loading to false if user is not logged in
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    handleUpdate({ file });
  };

  // const handleUpdateSuccess = async (updatedData) => {
  //   try {
  //     const userDocRef = doc(db, 'users', user.uid);
  //     await updateDoc(userDocRef, updatedData); // Update in Firebase
  //     setUserData((prev) => ({ ...prev, ...updatedData })); // Update local state
  //     setSnackbarOpen(true); // Show success message
  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //   }
  // };  

  const handleUpdateSuccess = async (updatedData) => {
    try {
      // Check if there's a file in updatedData
      let avatarURL = updatedData.avatarURL || user.photoURL;
  
      if (updatedData.file) {
        // Extract the file and remove it from updatedData
        const { file, ...dataWithoutFile } = updatedData;
  
        // Step 1: Upload the file to Cloudinary via your backend
        const formData = new FormData();
        formData.append('image', file);
  
        const response = await fetch('http://localhost:5000/api/auth/upload-avatar', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload avatar');
        }
  
        const data = await response.json();
        avatarURL = data.secure_url; // Extract the secure URL from the response
  
        // Step 2: Add the avatar URL to updatedData
        updatedData = { ...dataWithoutFile, avatarURL };
      }
  
      // Step 3: Update Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);
  
      // Update local state
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setSnackbarOpen(true); // Show success message
    } catch (error) {
      console.error('Error updating user data:', error.message);
      alert('Failed to update profile: ' + error.message);
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />; // Show loading spinner
  }

  if (!userData) {
    return <div>No user data found.</div>; // Show message if no user data is found
  }

  return (
    <Box className="profile-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card className="profile-card" sx={{ width: '100%', maxWidth: 600, p: 3 }}>
        <Box className="profile-avatar-container" sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img
            src={userData.avatarURL || '/images/default-avatar.png'}
            alt="User Avatar"
            className="profile-avatar"
            style={{ width: 150, height: 150, borderRadius: '50%' }}
          />
        </Box>
        <CardContent className="profile-info" sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
            {userData.name}
          </Typography>
          <Typography variant="body2" className="profile-info-text" sx={{ mb: 2 }}>
            Email: {userData.email}
          </Typography>
          {editing ? (
            <UpdateProfileForm userData={userData} onUpdate={handleUpdateSuccess} onCancel={() => setEditing(false)} /> // Pass onCancel prop
          ) : (
            <Button
              variant="contained"
              color="primary"
              className="profile-edit-button"
              onClick={() => setEditing(true)}
              startIcon={<EditIcon />} // Add EditIcon to the button
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;