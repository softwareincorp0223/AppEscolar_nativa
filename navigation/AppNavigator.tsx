import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Importa tus componentes de pantalla
//import Configuracion from '../src/screens/configuracion';
//import Calendario from '../src/screens/calendario';
//import Calificaciones from '../src/screens/calificaciones';
//import Mensajes from '../src/screens/mensajes';
//import Seguimientos from '../src/screens/seguimientos';
//import Tareas from '../src/screens/tareas';
//import LoginScreen from '../src/screens/login_scanner_escuelas';
//import Login from '../src/screens/login';
//import ScanerEscuelas from '../src/screens/scannerEscuelas';
//import DetallesAlumno from '../src/screens/detallesAlumno';
import LoginNativa from '../src/screens/Login_nativa';
//import Asistencias from '../src/screens/asistencias';

export type RootStackParamList = {
    Login: undefined;
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
            <Stack.Screen name="LoginNativa" component={LoginNativa} />
            {/*
            <Stack.Screen name="DetallesAlumno" component={DetallesAlumno} />
            <Stack.Screen name="Calendario" component={Calendario} />
            <Stack.Screen name="Asistencias" component={Asistencias} />
            <Stack.Screen name="Configuracion" component={Configuracion} />
            <Stack.Screen name="Calificaciones" component={Calificaciones} />
            <Stack.Screen name="Mensajes" component={Mensajes} />
            <Stack.Screen name="Seguimientos" component={Seguimientos} />
            <Stack.Screen name="Tareas" component={Tareas} />
            <Stack.Screen name="login_qr_escuelas" component={LoginScreen} />
            <Stack.Screen name="scannerEscuelas" component={ScanerEscuelas} />
            */}
        </Stack.Navigator>
    );
};
