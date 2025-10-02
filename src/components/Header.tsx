// src/components/Header.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔕 Comentado para usar después con notificaciones
// import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

interface Props {
  currentScreen: string;
  navigation: {
    navigate: (screen: string) => void;
  };
}

const Header: React.FC<Props> = ({ navigation }) => {
  const [alumno, setAlumno] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const isNameTooLong = (name: string) => name.length > 25;

  const fetchAlumnoNombre = useCallback(async () => {
    try {
      const idAlumno = await AsyncStorage.getItem('@idAlumno');
      if (!idAlumno) return;

      const formData = new FormData();
      formData.append('accion', 'consulta');
      formData.append('id_modificar', idAlumno);
      formData.append('detalles', 'detalles');

      const response = await fetch('http://aplicacionescolar.com/sistema/php/alumno.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data?.fila?.[0]) {
        const { nombre, apellido } = data.fila[0];
        setAlumno(`${nombre} ${apellido}`);
      }
    } catch (error) {
      console.error('Error al obtener nombre del alumno:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔕 Comentado para usar después con notifee
  /*
  const showNotificationInApp = useCallback(async (title: string, body: string) => {
    try {
      await notifee.requestPermission();
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId,
          pressAction: { id: 'default' },
        },
      });
    } catch (error) {
      console.error('Error al mostrar notificación:', error);
    }
  }, []);
  */

  useEffect(() => {
    fetchAlumnoNombre();

    // 🔕 Comentado para usar después con Firebase Messaging
    /*
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title ?? 'Notificación';
      const body = remoteMessage.notification?.body ?? '';
      showNotificationInApp(title, body);
    });

    return unsubscribe;
    */
  }, [fetchAlumnoNombre /*, showNotificationInApp */]);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={{ uri: 'http://aplicacionescolar.com/sistema/assets/img/logo_app_escolar.png' }}
          style={styles.logo}
        />

        {loading ? (
          <ActivityIndicator color="#fff" size="small" style={{ flex: 1 }} />
        ) : (
          <View style={isNameTooLong(alumno) ? styles.nameContainerLong : styles.nameContainer}>
            <Text style={isNameTooLong(alumno) ? styles.nameLong : styles.name}>
              {alumno}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DetallesAlumno')}
        >
          <FontAwesomeIcon icon={faUser} size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0d6efd',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0d6efd',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainerLong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameLong: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  button: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 5,
  },
});

export default Header;
