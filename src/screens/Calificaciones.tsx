import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Linking  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import { marcarVisto, notificaciones_dentro_app } from '../actions/Actions';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faFilePdf } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos necesarios

interface Props extends StackScreenProps<any, any>{};

export const Calificaciones = ( { navigation, route }: Props ) => {
    const currentScreen  = route.name === 'Calificaciones';
    const [calificaciones, setCalificaciones] = useState([]);
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
            const response = await marcarVisto('calificacion.php', idAlumno);
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

    const handleShowCalificaciones = async () => {
        try {
            const idAlumno = await AsyncStorage.getItem('@idAlumno');

            let formData = new FormData(); // Crea un objeto FormData con los datos del formulario
            formData.append("accion", "consulta");
            formData.append("id_modificar", idAlumno);
            formData.append("detalles", "detalles");

            const response = await fetch(`http://aplicacionescolar.com/sistema/php/calificacion.php`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const apiData = await response.json();

            setCalificaciones(apiData.fila);
            handleMarcarVisto();
            handleNotificacionesNav();
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
        handleNotificacionesNav();
        handleMarcarVisto();
        handleShowCalificaciones();
    }, []);
    
    const handleDescagarBoleta = async (id_evaluacion) => {
        let formData = new FormData(); // Crea un objeto FormData con los datos del formulario
        formData.append("id_evaluacion", id_evaluacion);

        const response = await fetch(`http://aplicacionescolar.com/sistema/php/pdf/reporteBoleta.php`, {
            method: 'POST',
            body: formData,
        });

        const apiData = await response.json();
        console.log(apiData);
        Linking.openURL('http://aplicacionescolar.com/sistema/php/pdf/' + apiData.archivo);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header currentScreen={route.name} navigation={navigation} />
            <View style={{ flex: 7 }}>
                <ScrollView style={{ marginBottom: 0}}>
                    <View style={style.cajaTituloSeccion}>
                        <Text style={style.cajaTituloSeccionText}> Calificaciones </Text>
                    </View>
                    {calificaciones && calificaciones.length > 0 ? (
                        calificaciones.map((calificacion, index) => (
                            <View style={styles.cardEvento}>
                                <View style={styles.rowContainer}>
                                    <View style={styles.cardEventoFecha}>
                                        <Image source={{uri: calificacion.foto == 0 || calificacion.foto === "El archivo no se pudo subir" ? foto_incono : 'http://aplicacionescolar.com/sistema/archivos/' + calificacion.foto }} style={styles.logoAlumno} />
                                    </View>
                                    <View style={[styles.cardEventoTexto, styles.cardEventoContainer]}>
                                        <Text style={{ textAlign: 'left', fontSize: 18, color: '#212529' }}>Ciclo Escolar: </Text>
                                        <Text style={{ textAlign: 'left', marginTop: 5, fontWeight: 'bold', color: '#212529' }}>{calificacion.ciclo}</Text>
                                    </View>
                                </View>
                                <View style={styles.rowContainer}>
                                    <View style={styles.cardEventoFecha}>
                                        <Image source={{uri: '' }} style={styles.logoAlumno} />
                                    </View>
                                    <View style={styles.cardEventoTexto}>
                                        <Text style={{ textAlign: 'left', fontSize: 16, color: '#212529' }}>Nivel: </Text>
                                        <Text style={{ textAlign: 'left', color: '#212529' }}>{calificacion.nombre_nivel}</Text>
                                    </View>
                                    <View style={styles.cardEventoTexto}>
                                        <Text style={{ textAlign: 'left', fontSize: 16, color: '#212529' }}>Grado: </Text>
                                        <Text style={{ textAlign: 'left', color: '#212529' }}>{calificacion.nombre_grado}</Text>
                                    </View >
                                    <View style={styles.cardEventoTexto}>
                                        <Text style={{ textAlign: 'left', fontSize: 16, color: '#212529' }}>grupo: </Text>
                                        <Text style={{ textAlign: 'left', color: '#212529' }}>{calificacion.nombre_grupo}</Text>
                                    </View>
                                </View>
                                <View style={styles.rowContainerButton}>
                                    <TouchableOpacity
                                        onPress={() => handleDescagarBoleta(calificacion.id_evaluacion)}
                                        style={styles.buttonYes}
                                    >
                                        <View style={styles.buttonCenter}>
                                            <FontAwesomeIcon icon={faFilePdf} size={15} color="#11452d" />
                                            <Text style={styles.buttonTextYes}>REPORTE PDF</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text></Text>
                    )}
                    
                </ScrollView>
                <Menu 
                    currentScreen={route.name} 
                    navigation={navigation}
                    onReload={handleShowCalificaciones}
                    notifications={notifications}  // Pasar el estado de las notificaciones
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardEvento: {
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
    rowContainerButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        top: -25
    },
    cardEventoFecha: {
        padding: 20,
    },
    cardEventoContainer: {
        paddingTop: 20,
    },
    cardEventoTexto: {
        flex: 1, // Para ocupar el espacio disponible
        alignItems: 'baseline', // Alinea el contenido de la vista a la línea de base
    },
    logoAlumno: {
        height: 50,
        width: 50,
        borderRadius: 50
    },
    buttonTextYes: {
        fontSize: 15,
        marginTop: 10,
        top: -5,
        color: '#11452d',
        marginStart: 7,
        textAlign: 'center'
    },
    buttonYes: {
        fontSize: 15,
        borderRadius: 5,
        borderWidth: 1, 
        borderColor: '#11452d',
        alignContent: 'center',
        width: 250
    },
    buttonCenter: {
        flexDirection: 'row',
        alignItems: 'center', // Centra los elementos verticalmente
        justifyContent: 'center', // Centra los elementos horizontalmente
        paddingHorizontal: 20, // Añade espacio horizontal entre el icono y el texto
        paddingVertical: 5, // Añade espacio horizontal entre el icono y el texto
    },
});

export default Calificaciones;
