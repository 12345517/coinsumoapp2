import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const route = useRoute();
  const { token } = route.params;

  const resetPassword = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/auth/reset-password/${token}`, { password });
      if (response.status === 200) {
        Alert.alert('Success', 'Password has been reset.');
      } else {
        Alert.alert('Error', 'Error resetting password.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={resetPassword} />
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

export default ResetPasswordScreen;