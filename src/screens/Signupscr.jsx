import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Alert } from 'react-native';
import React from 'react'
import { useEffect, useState } from 'react';
import { auth } from '../db/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { COLORS } from '../constants'
import { userSignUp } from '../db/firestore'

const Signupscr = ({ navigation }) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const handleSignup = async () => {
    if (password !== repassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      const userData = {
        avatar: 'avatar.png',
        email: email,
        password: password,
        userName: username,
        uid: user.uid,
        level: 0,
        points: 0,
        groups: [],
      };
      await userSignUp(userData);
      Alert.alert('Success', 'User created successfully!');
      navigation.navigate('Login')
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      </View>
      <View style={styles.inputContainer}>
      <TextInput
        value={repassword}
        onChangeText={setRepassword}
        placeholder="ReEnter Password"
        secureTextEntry
        style={styles.input}
      />
      </View>
      <TouchableOpacity style={styles.switch} onPress={handleSignup}>
        <Text style={styles.switchText}>Signup</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Signupscr

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
    padding: 10,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  switch: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  switchText: {
    fontSize: 16,
    textAlign: 'center',
  },
})