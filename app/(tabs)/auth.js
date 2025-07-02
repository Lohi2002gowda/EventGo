import { initializeApp } from 'firebase/app';  // Import the Firebase Web SDK initialization
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';  // Import auth functions from Firebase Web SDK
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase config initialization
const firebaseConfig = {
  apiKey: 'AIzaSyB5NCUPy6XVaPtPNEnsi_HFry5U-3ySNHU',
  authDomain: 'react-native-e5b9a.firebaseapp.com',
  projectId: 'react-native-e5b9a',
  storageBucket: 'react-native-e5b9a.appspot.com',
  messagingSenderId: '88557737556',
  appId: '1:88557737556:web:f4aafbe28dc4795adbbfc1',
  measurementId: 'G-XLCLTK7CV9',
  databaseURL: 'https://react-native-e5b9a.firebaseio.com',
};

// Initialize Firebase using the Firebase Web SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Get auth instance using the initialized app

export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw new Error(error.message);  // Throw error to be handled in Login component
  }
};

export const handleRegister = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    console.log('User registered:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering:', error.message);
    throw new Error(error.message);
  }
};