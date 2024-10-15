import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Importante!

const RegistroScreen = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ... otros estados ...
  const navigation = useNavigation(); // Obtener la navegación

  const register = async () => {
    try {
      const response = await axios.post('http://coinsumo.co/users/registro', {
        userId, name, email, password, // ... otros datos
      });

      if (response.status === 201) {
        Alert.alert('Registro exitoso!', 'Ahora puedes iniciar sesión.');
        navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
      } else {
        const errorData = await response.json();
        Alert.alert('Error de registro', errorData.message || 'Error desconocido');
      }
    } catch (error) {
      Alert.alert('Error de registro', 'Problema de conexión al servidor');
    }
  };

  return (
    <View style={styles.container}>
      {/* Inputs para userId, name, email, password, etc. */}
      <Button title="Registrarse" onPress={register} />
    </View>
  );
};

// ... styles ...

export default RegistroScreen;
 