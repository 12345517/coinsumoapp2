import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const requestPasswordReset = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      if (response.status === 200) {
        Alert.alert('Success', 'Recovery email sent.');
      } else {
        Alert.alert('Error', 'Error sending recovery email.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Request Password Reset" onPress={requestPasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8
  }
});

export default ForgotPasswordScreen;