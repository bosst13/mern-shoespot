import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { CircularProgress, Typography, Button, Card, CardContent, Snackbar, Alert, Box } from '@mui/material'; 
import UpdateProfileForm from './UpdateProfileForm';
import { UploadFile } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit'; 
import { styled } from '@mui/system';
import '../../Auth.css';

const Input = styled('input')({
  display: 'none',
});

const Profile = () => {
  const { user, handleUpdate } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [editing, setEditing] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        console.log('Fetching data for user:', user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            console.log('User document data:', userDoc.data());
            setUserData(userDoc.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    handleUpdate({ file });
  };

   const handleUpdateSuccess = async (updatedData) => {
    try {
      let avatarURL = updatedData.avatarURL || user.photoURL;
  
      if (updatedData.file) {
        const { file, ...dataWithoutFile } = updatedData;
  
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
        avatarURL = data.secure_url; 
        updatedData = { ...dataWithoutFile, avatarURL };
      }

      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, updatedData);
  
      setUserData((prev) => ({ ...prev, ...updatedData }));
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating user data:', error.message);
      alert('Failed to update profile: ' + error.message);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <div>No user data found.</div>;
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
            <UpdateProfileForm userData={userData} onUpdate={handleUpdateSuccess} onCancel={() => setEditing(false)} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              className="profile-edit-button"
              onClick={() => setEditing(true)}
              startIcon={<EditIcon />}
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