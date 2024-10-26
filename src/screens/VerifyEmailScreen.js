import React, { useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const VerifyEmailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { token } = route.params;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/auth/verify-email/${token}`);
        if (response.status === 200) {
          Alert.alert('Success', 'Email has been verified.');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Error verifying email.');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text>Verifying your email...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  }
});

export default VerifyEmailScreen;