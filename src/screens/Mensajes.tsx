//mensajes actualizado
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgCssUri } from 'react-native-svg/css';
import { Card } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { style } from '../theme/AppTheme';
import Menu from '../components/Navegacion';
import Header from '../components/Header';
import ContenidoMensaje from '../components/ContenidoMensaje';
import {
  handlePadre,
  handleInstituto,
  marcarVisto,
  notificaciones_dentro_app,
} from '../actions/Actions';

// ==========================
//  Tipos
// ==========================
interface Mensaje {
  id_mensaje: string;
  tipo_mensaje: string;
  asunto: string;
  mensaje: string;
  fecha_envio: string;
  hora_envio: string;
  icono: string;
  respuesta_rapida?: string;
}

interface ArchivoAdjunto {
  sid_mensaje: string;
  url: string;
}

interface LinkItem {
  sid_mensaje: string;
  url: string;
}

type Props = StackScreenProps<RootStackParamList, 'Mensajes'>;

// ==========================
//  Componente
// ==========================
export const Mensajes: React.FC<Props> = ({ navigation, route }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<ArchivoAdjunto[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [respuestas, setRespuestas] = useState([]);
  
  // 🔕 Comentado para usar después con notificaciones
  const [notifications, setNotifications] = useState({
    Mensajes: false,
    Tareas: false,
    Seguimientos: false,
    Calificaciones: false,
    Calendario: false,
    Asistencias: false,
    Configuracion: false,
  });

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const handleResponse = async (id_mensaje: string, respuesta: 'si' | 'no') => {
    try {
      const idAlumno = await AsyncStorage.getItem('@idAlumno');
      if (!idAlumno) return;

      const form = new FormData();
      form.append('accion', 'editar_mensaje_visto_aplication');
      form.append('id_mensaje', id_mensaje);
      form.append('idAlumno', idAlumno);
      form.append('respuesta_mensaje', respuesta);

      await fetch('http://aplicacionescolar.com/sistema/php/mensaje.php', {
        method: 'POST',
        body: form,
      });

      Alert.alert('✅ Mensaje enviado', 'Tu respuesta ha sido enviada correctamente.');
    } catch (error) {
      console.error('❌ Error al enviar respuesta:', error);
    }
  };

  const handleMarcarVisto = async () => {
    try {
      const idAlumno = await AsyncStorage.getItem('@idAlumno');
      if (idAlumno) {
        await marcarVisto('mensaje.php', idAlumno);
      }
    } catch {
      console.log('Error al marcar como visto');
    }
  };

  const handleNotificacionesNav = async () => {
    try {
      const response = await notificaciones_dentro_app();
      setNotifications(response);
      handleMarcarVisto();
    } catch {
      console.log('Error al actualizar notificaciones');
    }
  };

  const cargarMensajes = async () => {
    try {
      const idInstituto = await AsyncStorage.getItem('@idInstituto');
      const idAlumno = await AsyncStorage.getItem('@idAlumno');
      if (!idInstituto || !idAlumno) return;

      // Obtener info extra del alumno
      const datosAlumnoForm = new FormData();
      datosAlumnoForm.append('accion', 'alumno_info_extra');
      datosAlumnoForm.append('id_hijo', idAlumno);

      const infoResponse = await fetch(
        'http://aplicacionescolar.com/sistema/php/alumno.php',
        { method: 'POST', body: datosAlumnoForm }
      );
      const infoData = await infoResponse.json();
      const alumno = infoData.alumno[0];
      const extracurricular = infoData.extracurricular || [];
      const destinatarios = infoData.destinatarios || [];

      const idExtracurricular = extracurricular.map((e: any) => e.sid_extracurricular);
      const idDestinatarios = destinatarios.map((d: any) => d.sid_mensaje);

      const array_mensajes = [
        alumno.sid_nivel,
        alumno.sid_grado,
        alumno.sid_grupo,
        idAlumno,
        idInstituto,
        idExtracurricular,
        idDestinatarios,
      ];
      await AsyncStorage.setItem('array_mensajes', JSON.stringify(array_mensajes));

      // Solicitar mensajes
      const form = new FormData();
      form.append('accion', 'consulta_aplicacion');
      form.append('id_individual', array_mensajes.toString());
      form.append('id_array_destinatarios', idDestinatarios.toString());
      form.append('id_array_extracurricular', idExtracurricular.toString());

      const response = await fetch('http://aplicacionescolar.com/sistema/php/mensaje.php', {
        method: 'POST',
        body: form,
      });

      const data = await response.json();
      console.log('data mensajes');
      console.log(data);
      setMensajes(data.datos || []);
      setArchivosAdjuntos(data.datos_archivo || []);
      setLinks(data.datos_url || []);
      setRespuestas(data.respuesta_rapida || []);

      // Comentado para usar después con notificaciones
      handleNotificacionesNav();

    } catch (error) {
      console.error('❌ Error al cargar mensajes:', error);
    }
  };

  useEffect(() => {
    cargarMensajes();
    handlePadre();
    handleInstituto();
  }, []);

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#0d6efd" }}>
      
      {/* Header */}
      <Header currentScreen={route.name} navigation={navigation} />

      {/* Contenido principal */}
      <View style={{ flex: 7, backgroundColor: "#F7F3F9" }}>

        <ScrollView style={{ flex: 1, marginBottom: 0, paddingTop: 10 }}>
          <View style={style.cajaTituloSeccion}>
            <Text style={style.cajaTituloSeccionText}>Mensajes</Text>
          </View>

          {mensajes.map((mensaje) => (
            <Card key={mensaje.id_mensaje} style={styles.cardContent}>
              <Card.Content>
                <Card.Title
                  style={styles.titleCard}
                  title={mensaje.tipo_mensaje}
                  titleStyle={{ color: 'white' }}
                  subtitle={`${mensaje.fecha_envio} ${mensaje.hora_envio}`}
                  subtitleStyle={{ color: 'white', top: -5 }}
                  left={() => (
                    <SvgCssUri
                      width={30}
                      height={30}
                      style={{ backgroundColor: 'white', borderRadius: 50 }}
                      uri={`http://aplicacionescolar.com/sistema/assets/img/Tipo mensaje/${mensaje.icono}`}
                    />
                  )}
                />

                <Text style={[styles.contenidoTextDefault, style.textoGris]}>
                  Asunto:
                  <Text style={styles.contenidoText}> {mensaje.asunto}</Text>
                </Text>

                <Text style={[styles.contenidoTextDefault, style.textoGris]}>Mensaje:</Text>
                <ContenidoMensaje mensaje={mensaje.mensaje} />

                {/* Archivos y links */}
                <Text style={styles.contenidoTextDefault}>Archivos Adjuntos:</Text>
                {archivosAdjuntos.length > 0 && archivosAdjuntos
                    .filter(archivo => archivo.sid_mensaje === mensaje.id_mensaje)
                    .map((archivo, index) => (
                    archivo.url && (
                        <TouchableOpacity key={index} onPress={() => handleLinkPress('http://aplicacionescolar.com/sistema/archivos/' + archivo.url)}>
                            <Text style={style.textoGris}>{archivo.url}</Text>
                        </TouchableOpacity>
                    )
                ))}

                <Text style={styles.contenidoTextDefault}>Links:</Text>
                {links.length > 0 && links
                    .filter(link => link.sid_mensaje === mensaje.id_mensaje)
                    .map((link, index) => (
                    link.url && (
                        <TouchableOpacity key={index} onPress={() => handleLinkPress(link.url)}>
                            <Text style={style.textoGris}>{link.url}</Text>
                        </TouchableOpacity>
                    )
                ))}

                {/* Respuesta rápida */}
                {mensaje.respuesta_rapida && (
                  <Card.Actions style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => handleResponse(mensaje.id_mensaje, 'si')}
                      style={styles.buttonYes}
                    >
                      <View style={styles.buttonCenter}>
                        <FontAwesomeIcon icon={faCheck} size={15} color="#11452d" />
                        <Text style={styles.buttonTextYes}>Si</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleResponse(mensaje.id_mensaje, 'no')}
                      style={styles.buttonNo}
                    >
                      <View style={styles.buttonCenter}>
                        <FontAwesomeIcon icon={faX} size={15} color="#dc3545" />
                        <Text style={styles.buttonTextNo}>No</Text>
                      </View>
                    </TouchableOpacity>
                  </Card.Actions>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Menú inferior */}
        <Menu
          currentScreen={route.name}
          navigation={navigation}
          onReload={cargarMensajes}
          notifications={notifications}
        />
      </View  >

    </SafeAreaView>
  );
};

// ==========================
// Estilos
// ==========================
const styles = StyleSheet.create({
  headerTop: {
        marginStart: 7
    },
    buttonTextYes: {
        fontSize: 15,
        marginTop: 10,
        top: -5,
        color: '#11452d',
        marginStart: 7
    },
    buttonTextNo: {
        fontSize: 15,
        marginTop: 10,
        top: -5,
        color: '#dc3545',
        marginStart: 7
    },
    titleCard: {
        backgroundColor: '#4885df',
        borderRadius: 10, // Define el radio de borde para que sea redondeado
        marginBottom: 10, // Elimina el margen inferior
    },
    cardContent: {
        marginBottom: 10,
        padding: 0,
        marginHorizontal: 20,
        backgroundColor: 'white',
    },
    contenidoTextDefault: {
        fontSize: 15,
        fontWeight: 'bold',
        padding: 5,
        color: '#212529'
    },
    contenidoText: {
        fontSize: 15,
        fontWeight: 'normal',
        lineHeight: 23,
        color: '#212529'
    },
    buttonYes: {
        fontSize: 15,
        borderRadius: 5,
        borderWidth: 1, 
        borderColor: '#11452d',
        alignContent: 'center'
    },
    buttonNo: {
        fontSize: 15,
        borderRadius: 5,
        borderWidth: 1, 
        borderColor: '#dc3545',
        alignContent: 'center'
    },
    buttonCenter: {
        flexDirection: 'row',
        alignItems: 'center', // Centra los elementos verticalmente
        paddingHorizontal: 20, // Añade espacio horizontal entre el icono y el texto
        paddingVertical: 5, // Añade espacio horizontal entre el icono y el texto
    },
});

export default Mensajes;
