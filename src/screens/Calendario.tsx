import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import { marcarVisto, notificaciones_dentro_app } from '../actions/Actions';

interface Props extends StackScreenProps<any, any> { };

export const Calendario = ({ navigation, route }: Props) => {
    const [eventos, setEventos] = useState([]);
    const [notifications, setNotifications] = useState({
        Mensajes: false, Tareas: false, Seguimientos: false, Calificaciones: false, Calendario: false, Asistencias: false, Configuracion: false
    });

    const [mesSeleccionado, setMesSeleccionado] = useState(null);
    const [añoSeleccionado, setAñoSeleccionado] = useState(null);

    const [openMes, setOpenMes] = useState(false);
    const [openAño, setOpenAño] = useState(false);

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const currentYear = new Date().getFullYear();
    const años = [currentYear - 1, currentYear, currentYear + 1];

    useEffect(() => {
        handleNotificacionesNav();
        handleMarcarVisto();
        handleShowEventos();
    }, []);

    const handleMarcarVisto = async () => {
        const idAlumno = await AsyncStorage.getItem('@idAlumno');
        try { await marcarVisto('evento.php', idAlumno); } catch { }
    };

    const handleNotificacionesNav = async () => {
        try { setNotifications(await notificaciones_dentro_app()); } catch { }
    };

    const handleShowEventos = async () => {
        try {
            const stored = await AsyncStorage.getItem('array_mensajes');
            const ids = JSON.parse(stored);
            let formData = new FormData();
            formData.append("accion", "consulta");
            formData.append("id_modificar", ids);
            formData.append("detalles", "detalles");
            const res = await fetch(`http://aplicacionescolar.com/sistema/php/evento.php`, { method: 'POST', body: formData });
            const data = await res.json();
            setEventos(data.fila);
        } catch { }
    };

    const handleFetchEventos = async (mes, año) => {
        if (!mes || !año) return;
        try {
            const mapMes = { Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6, Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12 };
            const idAlumno = await AsyncStorage.getItem('@idAlumno');
            let formData = new FormData();
            formData.append("accion", "filtro_app");
            formData.append("mes", mapMes[mes]);
            formData.append("year", año);
            formData.append("id", idAlumno);
            const res = await fetch(`http://aplicacionescolar.com/sistema/php/evento.php`, { method: 'POST', body: formData });
            const data = await res.json();
            setEventos(data.fila);
            handleMarcarVisto();
            handleNotificacionesNav();
        } catch { }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header currentScreen={route.name} navigation={navigation} />
            <View style={{ flex: 7 }}>
                <ScrollView style={{ marginBottom: 0 }}>
                    <View style={[style.cajaTituloSeccion, { height: 145 }]}>
                        <Text style={style.cajaTituloSeccionText}>Calendario</Text>

                        <View style={styles.cajaFiltro}>
                            {/* Dropdown Mes */}
                            <View style={{ flex: 1, marginHorizontal: 5, zIndex: 1000 }}>
                                <DropDownPicker
                                    open={openMes}
                                    value={mesSeleccionado}
                                    items={meses.map(m => ({ label: m, value: m }))}
                                    setOpen={setOpenMes}
                                    setValue={(callback) => {
                                        const value = callback(mesSeleccionado);
                                        setMesSeleccionado(value);
                                        handleFetchEventos(value, añoSeleccionado);
                                    }}
                                    placeholder="Seleccionar Mes"
                                    dropDownContainerStyle={{
                                        maxHeight: 500,        //  altura suficiente para mostrar todos
                                    }}
                                    listMode="FLATLIST"       //  evita el scroll interno
                                />
                            </View>

                            {/* Dropdown Año */}
                            <View style={{ flex: 1, marginHorizontal: 5, zIndex: 900 }}>
                                <DropDownPicker
                                    open={openAño}
                                    value={añoSeleccionado}
                                    items={años.map(a => ({ label: a.toString(), value: a }))}
                                    setOpen={setOpenAño}
                                    setValue={(callback) => {
                                        const value = callback(añoSeleccionado);
                                        setAñoSeleccionado(value);
                                        handleFetchEventos(mesSeleccionado, value);
                                    }}
                                    placeholder="Seleccionar Año"
                                    style={{ borderColor: 'gray' }}
                                    listMode="FLATLIST"       //  evita el scroll interno
                                />
                            </View>
                        </View>
                    </View>

                    {eventos.map((evento, index) => (
                        <View key={index} style={styles.cardEvento}>
                            <View style={styles.rowContainer}>
                                <View style={styles.cardEventoFecha}>
                                    <Text style={{ color: 'white', fontSize: 25, textAlign: 'center' }}>{new Date(evento.fecha_evento).getDate()}</Text>
                                    <Text style={{ color: 'white', textAlign: 'center' }}>{new Date(evento.fecha_evento).toLocaleString('es-ES', { month: 'long' })} {new Date(evento.fecha_evento).getFullYear()}</Text>
                                    <Text style={{ color: 'white', textAlign: 'center' }}>{new Date(`1970-01-01T${evento.hora}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                                </View>
                                <View style={styles.cardEventoTexto}>
                                    <Text style={{ fontSize: 18, color: '#212529', fontWeight: 'bold' }}>Evento: </Text>
                                    <Text style={{ marginTop: 5, color: '#212529' }}>{evento.nombre_evento}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <Menu
                    currentScreen={route.name}
                    navigation={navigation}
                    onReload={handleShowEventos}
                    notifications={notifications}  // Pasar el estado de las notificaciones
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cardEvento: { marginBottom: 20, zIndex: -1, marginHorizontal: 20, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 1, height: 3 }, shadowOpacity: 0.4, shadowRadius: 7 },
    rowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    cardEventoFecha: { backgroundColor: '#0d6efd', padding: 20 },
    cardEventoTexto: { padding: 20, flex: 1, alignItems: 'baseline' },
    cajaFiltro: { flexDirection: 'row', alignItems: 'center', top: 5 },
});

export default Calendario;
