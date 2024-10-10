import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [commissionPercentage, setCommissionPercentage] = useState('');

  // Efecto para cargar el porcentaje actual de la comisión al montar el componente
  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Error', 'No se encontró el token. Inicie sesión de nuevo.');
          return;
        }

        const response = await axios.get('http://coinsumo.co/entrepreneurs/commission', {
          headers: {
            Authorization: Bearer ({token})
          }
        });
        
        if (response.data.commissionPercentage !== undefined) {
          setCommissionPercentage(response.data.commissionPercentage.toString());
        } else {
          Alert.alert('Error', 'No se pudo obtener el porcentaje de comisión actual.');
        }
      } catch (error) {
        console.error('Error al cargar la comisión:', error);
        Alert.alert('Error', 'No se pudo cargar el porcentaje de comisión.');
      }
    };

    fetchCommission();
  }, []);

  const updateCommission = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'No se encontró el token. Inicie sesión de nuevo.');
        return;
      }

      await axios.put('http://coinsumo.co/entrepreneurs/updateCommission', 
        { commissionPercentage: parseFloat(commissionPercentage) }, 
        {
          headers: {
            Authorization: Bearer ({token})
          }
        });
      Alert.alert('Éxito', 'Comisión actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la comisión:', error);
      Alert.alert('Error', 'No se pudo actualizar la comisión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Porcentaje de Comisión Actual</Text>
      <TextInput
        style={styles.input}
        placeholder="Porcentaje de Comisión"
        value={commissionPercentage}
        onChangeText={setCommissionPercentage}
        keyboardType="numeric"
      />
      <Button title="Actualizar Comisión" onPress={updateCommission} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default SettingsScreen;
 