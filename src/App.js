import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegistroScreen from './screens/RegistroScreen'; // Importa la pantalla de registro
import ExampleComponent from './components/ExampleComponent'; // Asegúrate de que este componente exista

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
      <div className="App">
        <h1>Welcome to Coinsumo</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
        <ExampleComponent />
      </div>
    </NavigationContainer>
  );
};

export default App;