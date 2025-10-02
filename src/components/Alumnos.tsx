import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

// ==========================
// Tipos
// ==========================

// Definimos la estructura de un alumno
export interface Alumno {
  id_alumno: string;
  sid_instituto: string;
  nombre: string;
  apellido: string;
  matricula: string;
  foto?: string | number;
  mensajes_no_leidos?: number;
  seguimiento_no_leidos?: number;
  tareas_no_leidas?: number;
  evaluacion_no_leidos?: number;
  asistencia_no_leidas?: number;
}

// Props que recibe el componente
interface AlumnosProps {
  data: Alumno[];
  onRedirect: () => void;
}

// ==========================
// Componente
// ==========================
const Alumnos: React.FC<AlumnosProps> = ({ data, onRedirect }) => {
  // Manejar la selección de un alumno
  const handleCardPress = async (sid_alumno: string, sid_instituto: string) => {
    try {
      // Guardar en almacenamiento local
      await AsyncStorage.setItem('@idInstituto', sid_instituto);
      await AsyncStorage.setItem('@idAlumno', sid_alumno);

      // Consultar datos del alumno en backend
      const formData = new FormData();
      formData.append('accion', 'seleccionar_hijo');
      formData.append('id_hijo', sid_alumno);

      const response = await fetch('http://aplicacionescolar.com/webview/php/consultar_hijo.php', {
        method: 'POST',
        body: formData,
      });

      const apiData = await response.json();

      if (apiData.status === 'success') {
        await AsyncStorage.setItem('@sidGrupo', apiData.sid_grupo);
        await AsyncStorage.setItem('@idPadre', apiData.id_padre);

        // Redirigir a pantalla de Mensajes u otra según lógica
        onRedirect();
      } else {
        console.warn('No se pudo seleccionar al alumno:', apiData);
      }
    } catch (error) {
      console.error('Error al seleccionar alumno:', error);
    }
  };

  // Render de cada tarjeta de alumno
  const renderItem: ListRenderItem<Alumno> = ({ item }) => {
    const tieneNotificaciones =
      item.mensajes_no_leidos ||
      item.seguimiento_no_leidos ||
      item.tareas_no_leidas ||
      item.evaluacion_no_leidos ||
      item.asistencia_no_leidas;

    const imagenUri =
      !item.foto || item.foto === 0 || item.foto === 'El archivo no se pudo subir'
        ? 'https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg'
        : `http://aplicacionescolar.com/sistema/archivos/${item.foto}`;

    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item.id_alumno, item.sid_instituto)}
        style={styles.card}
      >
        <View style={styles.innerContainer}>
          <Image source={{ uri: imagenUri }} style={styles.imagen} />
          <View style={styles.textContainer}>
            <Text style={styles.nombre}>{`${item.nombre} ${item.apellido}`}</Text>
            <Text style={styles.detalle}>{item.matricula}</Text>
          </View>
        </View>
        {tieneNotificaciones ? <View style={styles.notificationDot} /> : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_alumno}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

// ==========================
// Estilos
// ==========================
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {},
  flatListContent: {
    flex: 1,
    height: 650,
    top: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    width: windowWidth * 0.8,
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    marginLeft: 10,
    width: '80%',
  },
  imagen: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  detalle: {
    fontSize: 12,
    color: 'black',
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default Alumnos;
