import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { marcarVisto, notificaciones_dentro_app } from '../actions/Actions';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpFromBracket, faCheck } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos necesarios

interface Props extends StackScreenProps<any, any>{};

export const Asistencias = ( { navigation, route }: Props ) => {
    const currentScreen  = route.name === 'Asistencias';
    const [asistencias, setAsistencias] = useState([]);
    const foto_incono = 'https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg'
    const [notifications, setNotifications] = useState({
        Mensajes: false,
        Tareas: false,
        Seguimientos: false,
        Calificaciones: false,
        Calendario: false,
        Asistencias: false,
        Configuracion: false,
    });
    
    const handleMarcarVisto = async () => {
        const idAlumno = await AsyncStorage.getItem('@idAlumno');

        try {
            const response = await marcarVisto('asistencia.php', idAlumno);
            console.log('Respuesta del servidor:', response);
        } catch (error) {
            console.log('Error al enviar los datos');
        }
    };

    const handleNotificacionesNav = async () => {
        try {
            const response = await notificaciones_dentro_app();
            setNotifications(response);  // Actualizar el estado con la respuesta
            console.log('Respuesta NAV:', response);
        } catch (error) {
            console.log('Error al enviar los datos');
        }
    };

    const handleShowAsistencias = async () => {
        try {
            const id_hijo = await AsyncStorage.getItem('@idAlumno');
            
            let datos = new FormData(); // Crea un objeto FormData con los datos del formulario
            datos.append("accion", "consulta_asistencias_app");
            datos.append("id_hijo", id_hijo);

            const response = await fetch(`http://aplicacionescolar.com/sistema/php/asistencia.php`, {
                method: 'POST',
                body: datos,
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const apiData = await response.json();

            console.log(apiData.fila)

            setAsistencias(apiData.fila);
            handleMarcarVisto();
            handleNotificacionesNav();
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    
    useEffect(() => {
        handleNotificacionesNav();
        handleMarcarVisto();
        handleShowAsistencias();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header currentScreen={route.name} navigation={navigation} />
            <View style={{ flex: 7 }}>
                <ScrollView style={{ marginBottom: 0}}>
                    <View style={[style.cajaTituloSeccion]}>
                        <Text style={style.cajaTituloSeccionText}>Asistencias</Text>
                    </View>
                    {asistencias.map((asistencia, index) => (
                        <View style={styles.cardAsistencia}>
                            <View style={styles.rowContainer}>
                                <View style={styles.cardEventoFecha}>
                                    <Image source={{uri: asistencia.foto == 0 || asistencia.foto === "El archivo no se pudo subir" ? foto_incono : 'http://aplicacionescolar.com/sistema/archivos/' + asistencia.foto}} style={styles.logoAlumno} />
                                </View>
                                <View style={[styles.cardEventoTexto]}>
                                    <Text style={{ textAlign: 'left', fontSize: 18, color: '#212529' }}>{asistencia.nombre} {asistencia.apellido} - {asistencia.matricula}</Text>
                                    <Text style={{ textAlign: 'left', marginTop: 5, fontWeight: 'bold', color: '#212529' }}>{asistencia.fecha_ingreso} {asistencia.hora}</Text>
                                    {asistencia.tipo === 'salida' ? (
                                        <View style={[styles.buttonUp, { borderColor: 'red'}]} >
                                            <View style={styles.buttonCenter} >
                                                <FontAwesomeIcon icon={faCheck} size={12} color="red" />
                                                <Text style={[styles.buttonTextUp, { color: 'red'}]}>Salida</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View style={[styles.buttonUp, { borderColor: 'green'}]} >
                                            <View style={styles.buttonCenter} >
                                                <FontAwesomeIcon icon={faCheck} size={15} color="green" />
                                                <Text style={[styles.buttonTextUp, { color: 'green'}]}>Entrada</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                <Menu 
                    currentScreen={route.name} 
                    navigation={navigation}
                    onReload={handleShowAsistencias}
                    notifications={notifications}  // Pasar el estado de las notificaciones
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardAsistencia: {
        marginBottom: 20,
        marginHorizontal: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardEventoFecha: {
        padding: 20,
    },
    cardEventoTexto: {
        padding: 20,
        //right: 100,
        flex: 1, // Para ocupar el espacio disponible
        alignItems: 'baseline', // Alinea el contenido de la vista a la línea de base
    },
    cajaFiltro: {
        flexDirection: 'row',
        alignItems: 'center',
        top: 5
    },
    selectContainer: {
        flex: 1,
        marginHorizontal: 5,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        overflow: 'hidden', // Para evitar que los bordes se superpongan a los selectores
    },
    select: {
        height: 40,
        fontSize: 13,
        paddingHorizontal: 5,
        minHeight: 50
    },
    buttonUp: {
        fontSize: 15,
        borderRadius: 10,
        borderWidth: 1, 
        alignContent: 'center',
        width: 120,
        marginTop: 20
    },
    buttonTextUp: {
        fontSize: 15,
        marginTop: 10,
        top: -5,
        color: '#11452d',
        marginStart: 7
    },
    buttonCenter: {
        flexDirection: 'row',
        alignItems: 'center', // Centra los elementos verticalmente
        paddingHorizontal: 20, // Añade espacio horizontal entre el icono y el texto
        paddingVertical: 5, // Añade espacio horizontal entre el icono y el texto
    },
    logoAlumno: {
        height: 50,
        width: 50,
        borderRadius: 50
    },
});

export default Asistencias;
