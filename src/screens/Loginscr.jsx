import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useProgressStore } from '../store/progressStore';
import { useEffect, useState } from 'react';
import { auth } from '../db/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {COLORS} from '../constants'

const Loginscr = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsAuthenticated = useProgressStore((state) => state.setIsAuthenticated);
  const setUid = useProgressStore((state) => state.setUid);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUid(user.uid);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.switch} onPress={handleLogin}>
        <Text style={styles.switchText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switch} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.switchText}>Signup</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Loginscr

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