import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJDC83ZIwfBmImdQ2qiTzkeVp7e-pzuAs",
  authDomain: "shoespot-f885d.firebaseapp.com",
  projectId: "shoespot-f885d",
  storageBucket: "shoespot-f885d.firebasestorage.app",
  messagingSenderId: "107379100136",
  appId: "1:107379100136:web:934841a3275a2f3b63bc5d",
  measurementId: "G-6JJ47W8NV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };