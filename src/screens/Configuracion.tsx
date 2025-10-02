import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { notificaciones_dentro_app } from '../actions/Actions';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faArrowLeft  } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos necesarios

import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';

interface Props extends StackScreenProps<any, any>{};

export const Configuracion = ({ navigation, route }: Props) => {
    const currentScreen = route.name === 'Configuracion';
    const [datosPadre, setDatosPadre] = useState([]);

    const [institutoNombre, setInstitutoNombre] = useState('');
    const [institutoCorreo, setInstitutoCorreo] = useState('');
    const [institutoLogo, setInstitutoLogo] = useState('');
    const [institutoDescripcion, setInstitutoDescripcion] = useState('');
    
    const [padreNombre, setPadreNombre] = useState('');
    const [padreApellido, setPadreApellido] = useState('');
    const [padreCorreo, setPadreCorreo] = useState('');

    const [notifications, setNotifications] = useState({
        Mensajes: false,
        Tareas: false,
        Seguimientos: false,
        Calificaciones: false,
        Calendario: false,
        Asistencias: false,
        Configuracion: false,
    });

    const handleNotificacionesNav = async () => {
        try {
            const response = await notificaciones_dentro_app();
            setNotifications(response);  // Actualizar el estado con la respuesta
            console.log('Respuesta NAV:', response);
        } catch (error) {
            console.log('Error al enviar los datos');
        }
    };

    useEffect(() => {
        const handleLogout = async () => {
            const logo_instituto = await AsyncStorage.getItem('@logo_instituto');
            const nombre_instituto = await AsyncStorage.getItem('@nombre_instituto');
            const correo_instituto = await AsyncStorage.getItem('@correo_instituto');
            const descripcion_instituto = await AsyncStorage.getItem('@descripcion_instituto');

            const nombre_padre = await AsyncStorage.getItem('@nombre_padre');
            const correo_padre = await AsyncStorage.getItem('@correo_padre');
            const apellido_padre = await AsyncStorage.getItem('@apellido_padre');

            console.log(nombre_instituto);
            setInstitutoNombre(nombre_instituto);
            setInstitutoCorreo(correo_instituto);
            setInstitutoLogo(logo_instituto);
            setInstitutoDescripcion(descripcion_instituto);

            setPadreNombre(nombre_padre);
            setPadreApellido(apellido_padre);
            setPadreCorreo(correo_padre);
        };

        handleLogout();
        handleNotificacionesNav();
    }, []);

    const image = {uri: 'http://aplicacionescolar.com/webview/public/assets/img/fondo-config.png'};
    const imageLogo = 'http://aplicacionescolar.com/webview/public/assets/img/fondo-config.png';

    const handleLogout = async () => {
        try {
      
            // Reasignar valores vacíos a las variables en AsyncStorage
            await AsyncStorage.setItem('@idPadre', '');
            await AsyncStorage.setItem('@token_sesion', '');
            
            navigation.navigate('LoginNativa');
      
            console.log('Sesión cerrada correctamente.');
            Alert.alert('Sesión cerrada correctamente.');
        } catch (error) {
            console.error('Error al cerrar la sesión:', error);
            Alert.alert('Error', 'Hubo un error al cerrar la sesión.');
        }
    };

    const handleBack = () => {
        //miFuncionAntesDeRegresar();  // <-- aquí ejecutas lo que tú quieras
        navigation.goBack();         // <-- luego regresas
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={image} resizeMode="cover" style={style.headerConfiguracion}>
                {/* Botón de regreso */}
            <TouchableOpacity onPress={handleBack} style={{ position: 'absolute', left: 15, top: 28 }}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="white" />
            </TouchableOpacity>
                <Text style={style.titleConfiguracion}>Configuración</Text>
            </ImageBackground>
            <View style={[style.containerDatosConfiguracion, style.datosPadre]}>
                <Image source={{uri: institutoLogo !== '' ? 'http://aplicacionescolar.com/sistema/archivos/' + institutoLogo : imageLogo }} style={style.logoEscuela} />
                <Text style={[style.textoPadre, style.textoGris]}>{padreNombre + ' ' + padreApellido}</Text>
                <Text style={[style.textoPadre, style.textoGris]}>{padreCorreo} </Text>
            </View>
            <View style={[style.containerDatosConfiguracion, {marginBottom: 0}]}>
                <Text style={[style.infoConfiguracion, style.textoGris]}>Información de la escuela</Text>
                <Text style={[style.infoConfiguracionText, style.textoGris]}>Nombre: <Text style={style.infoConfiguracionTextData}>{institutoNombre}</Text></Text>
                <Text style={[style.infoConfiguracionText, style.textoGris]}>Correo: <Text style={style.infoConfiguracionTextData}>{institutoCorreo}</Text></Text>
                <Text style={[style.infoConfiguracionText, style.textoGris]}>Descripcion: <Text style={style.infoConfiguracionTextData}>{institutoDescripcion}</Text></Text>
            </View>
            <TouchableOpacity 
                style={[style.containerDatosConfiguracion, {paddingBottom: 0}]}
                onPress={handleLogout}
            >
                <Text style={[style.infoConfiguracion, style.cerrarSesion, {top: -10}]}>Cerrar Sesion</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Configuracion;
