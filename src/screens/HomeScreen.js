import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const HomeScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    navigation.navigate('Backoffice');
                }
            } catch (error) {
                console.error("Error al verificar token:", error)
            }
        };

        checkToken();
    }, []);

    return (
        <View>
            {/Contenido de la pantalla/}
            <Button title="ir al Backoffice" onPress={()=> navigation.navigate("Backoffice")} /> {/Esto solo para pruebas/}
        </View>
    );
};

export default HomeScreen;
 