import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus componentes de pantalla
import DetallesAlumno from '../src/screens/DetallesAlumno';
import LoginNativa from '../src/screens/Login_nativa';
import Mensajes from '../src/screens/Mensajes';
import Tareas from '../src/screens/Tareas';
import Seguimientos from '../src/screens/Seguimientos';
import Calificaciones from '../src/screens/Calificaciones';
import Calendario from '../src/screens/Calendario';
import Asistencias from '../src/screens/Asistencias';
import Configuracion from '../src/screens/Configuracion';
import LoginScreen from '../src/screens/LoginScannerEscuelas';
import ScanerEscuelas from '../src/screens/ScannerEscuelas';
import ScreenLoad from "../src/screens/ScreenLoad";

export type RootStackParamList = {
    LoginNativa: undefined;
    DetallesAlumno: undefined;
    Calendario: undefined;
    Asistencias: undefined;
    Configuracion: undefined;
    Calificaciones: undefined;
    Mensajes: undefined;
    Seguimientos: undefined;
    Tareas: undefined;
    login_qr_escuelas: undefined;
    scannerEscuelas: undefined;
    ScreenLoad: undefined;
};

// Crea un navegador Stack tipado
const Stack = createStackNavigator<RootStackParamList>();

// Función que devuelve el componente de navegación principal
export const MainNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    elevation: 0, // quita sombra en Android
                    shadowColor: 'transparent', // quita sombra en iOS
                },
            }}
        >
            <Stack.Screen name="ScreenLoad" component={ScreenLoad} />
            <Stack.Screen name="LoginNativa" component={LoginNativa} />
            <Stack.Screen name="DetallesAlumno" component={DetallesAlumno} />
            <Stack.Screen name="Mensajes" component={Mensajes} />
            <Stack.Screen name="Tareas" component={Tareas} />
            <Stack.Screen name="Seguimientos" component={Seguimientos} />
            <Stack.Screen name="Calificaciones" component={Calificaciones} />
            <Stack.Screen name="Calendario" component={Calendario} />
            <Stack.Screen name="Asistencias" component={Asistencias} />
            <Stack.Screen name="Configuracion" component={Configuracion} />
            <Stack.Screen name="login_qr_escuelas" component={LoginScreen} />
            <Stack.Screen name="scannerEscuelas" component={ScanerEscuelas} />
        </Stack.Navigator>
    );
};
