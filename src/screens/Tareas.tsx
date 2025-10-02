import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Alert, Linking  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import { marcarVisto, notificaciones_dentro_app } from '../actions/Actions';
import ContenidoMensaje from '../components/ContenidoMensaje';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpFromBracket, faCheck } from '@fortawesome/free-solid-svg-icons'; // Importa los iconos necesarios

import {launchImageLibrary} from 'react-native-image-picker';

interface Props extends StackScreenProps<any, any>{};

export const Tareas = ( { navigation, route }: Props ) => {
    const currentScreen  = route.name === 'Tareas';
    const [tareas, setTareas] = useState([]); // Estado para almacenar los mensajes
    const [archivosAdjuntos, setArchivosAdjuntos] = useState([]); // Estado para almacenar los mensajes
    const [links, setLinks] = useState([]); // Estado para almacenar los mensajes
    const [estadoArchivo, setEstadoArchivo] = useState("pendiente");
    const [notifications, setNotifications] = useState({
        Mensajes: false,
        Tareas: false,
        Seguimientos: false,
        Calificaciones: false,
        Calendario: false,
        Asistencias: false,
        Configuracion: false,
    });

    const handleLinkPress = (url) => {
        // Configurar la ruta de destino para guardar el archivo
        Linking.openURL(url);
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

    const handleMarcarVisto = async () => {
        const idAlumno = await AsyncStorage.getItem('@idAlumno');

        try {
            const response = await marcarVisto('tareas.php', idAlumno);
            setNotifications(response);  // Actualizar el estado con la respuesta
            console.log('Respuesta del servidor:', response);
        } catch (error) {
            console.log('Error al enviar los datos');
        }
    };

    const handleShowTareas = async () => {
        try {
            const idAlumno = await AsyncStorage.getItem('@idAlumno');
            
            let formData = new FormData(); // Crea un objeto FormData con los datos del formulario
            formData.append("accion", "consulta");
            formData.append("id_modificar", idAlumno);
            formData.append("detalles", "detalles");

            const response = await fetch(`http://aplicacionescolar.com/sistema/php/tareas.php`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }

            const apiData = await response.json();
            setTareas(apiData.fila);
            handleMarcarVisto();
            handleNotificacionesNav();
        } catch (error) {
            //console.error('Error en la solicitud:', error);
        }
    };

    useEffect(() => {
        handleNotificacionesNav();
        handleMarcarVisto();
        handleShowTareas();
    }, []);

    const handleSubirArchivo = async (id_asignar_tarea) => {
    const options = {
        mediaType: 'mixed', // permite imágenes, videos y documentos en Android
        selectionLimit: 1,
    };

    launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('Selección cancelada');
                return;
            }

            if (response.errorCode) {
                console.error('Error al seleccionar archivo:', response.errorMessage);
                return;
            }

            const asset = response.assets?.[0];
            if (!asset) return;

            const formData = new FormData();
            formData.append('accion', 'archivo_tarea_respuesta');
            formData.append('archivo', {
                uri: asset.uri,
                name: asset.fileName || 'archivo.jpg',
                type: asset.type || 'application/octet-stream',
            });
            formData.append('tarea_id', id_asignar_tarea);

            try {
                const uploadResponse = await fetch(`http://aplicacionescolar.com/sistema/php/tareas.php`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const data = await uploadResponse.json();

                if (uploadResponse.ok) {
                    Alert.alert('Listo', 'Archivo subido correctamente');
                } else {
                    Alert.alert('Error', 'No se pudo subir el archivo');
                }
            } catch (error) {
                console.error('Error al subir archivo:', error);
            }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header currentScreen={route.name} navigation={navigation} />
            <View style={{ flex: 7 }}>
                <ScrollView style={{ marginBottom: 0}}>
                    <View style={style.cajaTituloSeccion}>
                        <Text style={style.cajaTituloSeccionText}> Tareas </Text>
                        <View style={styles.cajaTareasBadge}>
                            <Text style={[styles.cajaTareasBadgeText, { borderColor: 'grey', color: 'grey' }]}> Pendiente </Text>
                            <Text style={[styles.cajaTareasBadgeText, { borderColor: 'green', color: 'green' }]}> Enviado </Text>
                            <Text style={[styles.cajaTareasBadgeText, { borderColor: 'blue', color: 'blue' }]}> Revisado </Text>
                            <Text style={[styles.cajaTareasBadgeText, { borderColor: 'red', color: 'red' }]}> Observación </Text>
                        </View>
                    </View>
                    {tareas.map((tarea, index) => (
                        <View style={styles.cardTarea}>
                            <View>
                                <Text style={styles.tareaTitle}>{tarea.nombre_tarea}</Text>
                                <Text>{tarea.fecha_creacion}</Text>
                            </View>
                            <View style={styles.tareaInstrucciones}>
                                
                                <ContenidoMensaje mensaje={tarea.instrucciones_tarea} />
                            </View>
                            
                            <Text style={styles.tareaUrl}>Archivos Adjuntos: </Text>
                            {tarea.archivos_tarea.length > 0 && tarea.archivos_tarea
                                .filter(archivo => archivo.sid_tarea === tarea.id_tarea)
                                .map((archivo, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => handleLinkPress('http://aplicacionescolar.com/sistema/archivos/' + archivo)}>
                                        <Text style={{color: 'grey'}} >{archivo}</Text>
                                    </TouchableOpacity>
                            ))}

                            <Text style={styles.tareaUrl}>URL: </Text>
                            {tarea.url_tarea.length > 0 && tarea.url_tarea
                                .filter(url => url.sid_tarea === tarea.id_tarea)
                                .map((url, idx) => (
                                    <TouchableOpacity key={idx} onPress={() => handleLinkPress(url)}>
                                        <Text style={{color: 'grey'}}>{url}</Text>
                                    </TouchableOpacity>
                            ))}
                            
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    onPress={() => handleSubirArchivo(tarea.id_asignar_tarea)}
                                    style={styles.buttonUp}
                                >
                                    <View style={styles.buttonCenter}>
                                        <FontAwesomeIcon icon={faArrowUpFromBracket} size={13} color="#11452d" />
                                        <Text style={styles.buttonTextUp}>Subir</Text>
                                    </View>
                                </TouchableOpacity>

                                {tarea.estatus_tarea === 'observacion' ? (
                                    <View style={[styles.buttonUp, { borderColor: 'red'}]} >
                                        <View style={styles.buttonCenter} >
                                            <FontAwesomeIcon icon={faCheck} size={12} color="red" />
                                            <Text style={[styles.buttonTextUp, { color: 'red'}]}>Obs...</Text>
                                        </View>
                                    </View>
                                ) : tarea.estatus_tarea === 'enviado' ? (
                                    <View style={[styles.buttonUp, { borderColor: 'green'}]} >
                                        <View style={styles.buttonCenter} >
                                            <FontAwesomeIcon icon={faCheck} size={12} color="green" />
                                            <Text style={[styles.buttonTextUp, { color: 'green'}]}>Enviado</Text>
                                        </View>
                                    </View>
                                ) : tarea.estatus_tarea === 'revisado' ? (
                                    <View style={[styles.buttonUp, { borderColor: 'blue'}]} >
                                        <View style={styles.buttonCenter} >
                                            <FontAwesomeIcon icon={faCheck} size={12} color="blue" />
                                            <Text style={[styles.buttonTextUp, { color: 'blue'}]}>Revisado</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[styles.buttonUp, { borderColor: 'grey'}]} >
                                        <View style={styles.buttonCenter} >
                                            <FontAwesomeIcon icon={faCheck} size={12} color="grey" />
                                            <Text style={[styles.buttonTextUp, { color: 'grey'}]}>Pendiente</Text>
                                        </View>
                                    </View>
                                )}

                            </View>

                            {tarea.estatus_tarea === 'observacion' ? (
                                <View style={styles.cajaObservacion}>
                                    <Text style={[style.textoGris, { fontWeight: 'bold', fontSize: 15}]}>Observación:</Text>
                                    <Text style={style.textoGris}>{tarea.observacion_tarea}</Text>
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
                    onReload={handleShowTareas}
                    notifications={notifications}  // Pasar el estado de las notificaciones
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardTarea: {
        padding: 20,
        marginBottom: 20,
        marginHorizontal: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#0d6efd'
    },
    tareaTitle: {
        fontSize: 23,
        color: '#0d6efd',
    },
    tareaInstrucciones: {
        marginTop: 10
    },
    tareaUrl: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,
        color: '#212529',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
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
        fontSize: 13,
        marginTop: 10,
        top: -5,
        color: '#11452d',
        marginStart: 7
    },
    buttonCenter: {
        flexDirection: 'row',
        alignItems: 'center', // Centra los elementos verticalmente
        paddingHorizontal: 15, // Añade espacio horizontal entre el icono y el texto
        paddingVertical: 5, // Añade espacio horizontal entre el icono y el texto
    },
    cajaTareasBadge: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    cajaTareasBadgeText: {
        fontSize: 12,
        marginHorizontal: 5,
        borderWidth: 1, 
        padding: 5,
        borderRadius: 5,
        margin: 5,
    },
    cajaObservacion: {
        paddingTop: 15,
        marginLeft: 10
    }
});

export default Tareas;
