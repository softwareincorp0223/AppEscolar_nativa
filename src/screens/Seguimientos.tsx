import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgCssUri } from "react-native-svg/css";
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import { marcarVisto, notificaciones_dentro_app } from '../actions/Actions';

interface Props extends StackScreenProps<any, any>{};

export const Seguimientos = ( { navigation, route }: Props ) => {
    const currentScreen  = route.name === 'Seguimientos';
    const [seguimientos, setSeguimientos] = useState([]);
    const [atributos, setAtributos] = useState([]);
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
            const response = await marcarVisto('seguimiento.php', idAlumno);
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

    const handleShowSeguimientos = async () => {
        try {
            const idAlumno = await AsyncStorage.getItem('@idAlumno');

            let datos_seguimientos = new FormData(); // Crea un objeto FormData con los datos del formulario
            datos_seguimientos.append("accion", "consulta_aplicacion");
            datos_seguimientos.append("id", idAlumno);

            const response = await fetch(`http://aplicacionescolar.com/sistema/php/seguimiento.php`, {
                method: 'POST',
                body: datos_seguimientos,
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const apiData = await response.json();

            setSeguimientos(apiData.datos);
            setAtributos(apiData.atributos);
            handleMarcarVisto();
            handleNotificacionesNav();
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {        
        handleNotificacionesNav();
        handleMarcarVisto();
        handleShowSeguimientos();
    }, []);
    
    // Obtener las dimensiones de la pantalla
    const windowWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header currentScreen={route.name} navigation={navigation}/>
            <View style={{ flex: 7 }}>
                <ScrollView style={{ marginBottom: 0}}>
                    <View style={style.cajaTituloSeccion}>
                        <Text style={style.cajaTituloSeccionText}> Seguimientos </Text>
                    </View>
                    {seguimientos.map((mensaje) => (
                        <View style={styles.cardSeguimiento}>
                            <View>
                                <Text style={styles.seguimientoTitle}>{mensaje.fecha_registro}</Text>
                            </View>
                            <View style={styles.seguimientoTarjetaIconoContainer}>
                                {atributos
                                .filter(atributo => atributo.sid_seguimiento === mensaje.id_seguimiento)
                                .map((atributo, index) => (
                                    <View style={[styles.seguimientoTarjetaIcono, { width: windowWidth / 3 }]} key={index}>
                                        <Text style={style.textoGris}>{atributo.nombre}</Text>
                                        <SvgCssUri
                                            width={50} // ajusta el ancho según tus necesidades
                                            height={50} // ajusta la altura según tus necesidades
                                            uri={`http://aplicacionescolar.com/sistema/assets/img/sticker/${atributo.icono}`}
                                            style={styles.seguimientoIcono}
                                        />
                                        <Text style={style.textoGris}>{atributo.valor_atributo}</Text>
                                    </View>
                                ))}
                            </View>
                            <View>
                                <Text style={styles.seguimientoobservacion}>{mensaje.fecha}</Text>
                            </View>

                            {mensaje.observacion !== '' ? (
                                <View style={styles.cajaObservacion}>
                                    <Text style={[style.textoGris, { fontWeight: 'bold', fontSize: 15}]}>Observación:</Text>
                                    <Text style={style.textoGris}>{mensaje.observacion}</Text>
                                </View>
                            ) : (
                                <Text></Text>
                            )}
                        </View>
                    ))}
                </ScrollView>
                <Menu
                    currentScreen={route.name}
                    navigation={navigation}
                    onReload={handleShowSeguimientos}
                    notifications={notifications}  // Pasar el estado de las notificaciones
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardSeguimiento: {
        padding: 20,
        marginBottom: 20,
        marginHorizontal: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        borderRadius: 10,
    },
    seguimientoTitle: {
        fontSize: 20,
        color: '#0d6efd'
    },
    seguimientoIcono: {
        width: 50,
        height: 50,
    },
    seguimientoTarjetaIconoContainer: {
        flexDirection: 'row', // Esto colocará los elementos en una fila
        flexWrap: 'wrap', // Si hay demasiados elementos para caber en una fila, se envolverán a la siguiente fila
    },
    seguimientoTarjetaIcono: {
        marginRight: 5, // Margen derecho entre los elementos
        marginBottom: 5, // Margen inferior entre las filas de elementos
        marginTop: 10,
        alignItems: 'center', // Alinea los elementos al centro horizontalmente
    },
    seguimientoobservacion: {
        
    },
    cajaObservacion: {
        paddingTop: 15,
        marginLeft: 10
    }
});


export default Seguimientos;
