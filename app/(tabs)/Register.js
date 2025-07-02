import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handleRegister } from './auth';
import LinearGradient from 'react-native-linear-gradient';
import * as Font from 'expo-font';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  const registerUser = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const user = await handleRegister(email, password);
      console.log('Registered user email:', user.email);
      navigation.navigate('Login'); // Redirect to Login after registration
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Registration failed:', error.message);
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'SFProRounded-Regular': require('../../assets/fonts/SF-Pro-Rounded-Heavy.otf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading font:', error);
      }
    };
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <LinearGradient colors={['#000000', '#800080']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.formContainer}>
          <Text style={styles.heading}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#fff"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <Button title="Register" onPress={registerUser} color="#800080" />
          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            Already have an account? Login
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
  },
  heading: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'SFProRounded-Regular',
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SFProRounded-Regular',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'SFProRounded-Regular',
  },
  linkText: {
    marginTop: 10,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});
