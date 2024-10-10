import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://coinsumo.co/api', // Asegúrate de que esto sea correcto
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = Bearer ({token}); // Añadir el token al encabezado
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Puedes exportar esta configuración para usarla en el resto de tu app
export default api;
 