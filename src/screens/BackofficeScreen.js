import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackofficeScreen = () => {
  const [referrals, setReferrals] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBackofficeData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token. Inicie sesión de nuevo.');
          return;
        }

        // Obtener referidos
        const referralsResponse = await axios.get('http://coinsumo.co/users/referrals', {
          headers: {
            Authorization: Bearer ({token})
          }
        });

        // Obtener transacciones
        const transactionsResponse = await axios.get('http://coinsumo.co/users/transactions', {
          headers: {
            Authorization: Bearer ({token})
          }
        });

        setReferrals(referralsResponse.data);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error al cargar el backoffice:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del backoffice.');
      }
    };

    fetchBackofficeData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Referidos</Text>
      <FlatList
        data={referrals}
        keyExtractor={(item) => item._id} // Asegúrate de que tus referidos tengan un ID único
        renderItem={({ item }) => (
          <Text style={styles.item}>Nombre: {item.name} - Puntos: {item.points}</Text>
        )}
      />
      <Text style={styles.title}>Tus Transacciones</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id} // Asegúrate de que tus transacciones tengan un ID único
        renderItem={({ item }) => (
          <Text style={styles.item}>Monto: {item.amount} - Tipo: {item.type} - Fecha: {item.date}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  item: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default BackofficeScreen;
 