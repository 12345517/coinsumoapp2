import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RegistroScreen from './src/screens/RegistroScreen'; // Importa la pantalla de registro
// ... otros imports ...

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} /> {/* Agrega la ruta de registro */}
        {/* ... otras pantallas ... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;