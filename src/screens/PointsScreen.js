import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import api from '../services/api'; // Importa la instancia de axios que configuraste
import AsyncStorage from '@react-native-async-storage/async-storage';

const PointsScreen = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Obtener el token de sesión
        if (!token) {
          Alert.alert('Error', 'No se encontró el token. Inicie sesión de nuevo.');
          return;
        }

        // Hacer la solicitud a la API usando la instancia de api.js
        const response = await api.get('/users/points'); // Asegúrate de que este endpoint sea correcto

        setPoints(response.data.totalPoints); // Actualiza el estado con el total de puntos
      } catch (error) {
        console.error('Error al cargar los puntos:', error);
        Alert.alert('Error', 'No se pudieron cargar los puntos.');
      }
    };

    fetchPoints();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Puntos</Text>
      <Text style={styles.points}>{points}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  points: {
    fontSize: 36,
  },
});

export default PointsScreen;
 