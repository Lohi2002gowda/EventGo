import * as React from 'react';
import { useState, useEffect } from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import Login from './Login';
import Home from './Home';
import Admin from './Admin'; // Ensure Admin is correctly imported

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

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('Login'); // Keeps track of which screen to show
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }, []);

  const handleLogin = (email) => {
    const adminCheck = email.startsWith('admin');
    setIsAdmin(adminCheck);
    setCurrentScreen(adminCheck ? 'Admin' : 'Home');
  };

  const renderScreen = () => {
    if (currentScreen === 'Login') {
      return <Login onLoginSuccess={handleLogin} />;
    }
    if (currentScreen === 'Home') {
      return <Home />;
    }
    if (currentScreen === 'Admin') {
      return <Admin />;
    }
  };

  return renderScreen();
};

export default App;
