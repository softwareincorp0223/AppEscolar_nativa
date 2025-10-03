//camara
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { Camera } from 'react-native-camera-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { initNotifications } from '../actions/Notifications';

const LoginNativa = () => {
  const [scanSuccessful, setScanSuccessful] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
  initNotifications(); // Se ejecuta al iniciar la app
}, []);

const POST_NOTIFICATIONS = 'android.permission.POST_NOTIFICATIONS' as const;

const requestNotificationPermission = async () => {
  if (Platform.OS !== 'android') return RESULTS.UNAVAILABLE;

  const sdk = typeof Platform.Version === 'number' ? Platform.Version : parseInt(String(Platform.Version), 10) || 0;
  if (sdk < 33) return RESULTS.GRANTED; // Android <13 no necesita prompt

  try {
    let status = await check(POST_NOTIFICATIONS);

    if (status === RESULTS.DENIED) {
      status = await request(POST_NOTIFICATIONS);
    }

    return status;
  } catch (err) {
    console.error('Error solicitando permisos de notificación:', err);
    return null;
  }
};

function checkCameraPermission() {
    check(PERMISSIONS.ANDROID.CAMERA)
      .then((result) => {
        if (result === RESULTS.DENIED) {
          request(PERMISSIONS.ANDROID.CAMERA)
            .then((newResult) => {
              console.log('Permisos de cámara otorgados:', newResult);
            })
            .catch((error) => {
              console.error('Error al solicitar permisos de cámara:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error al verificar los permisos de cámara:', error);
      });
  }

  useEffect(() => {

    checkCameraPermission();

  }, []);

  // Verificar sesión guardada
  const verificarSesion = async () => {
    const idPadre = await AsyncStorage.getItem('@idPadre');
    const token_sesion = await AsyncStorage.getItem('@token_sesion');

    //await AsyncStorage.setItem('@idPadre', '1ek6wunuzo');
    //await AsyncStorage.setItem('@token_sesion', 'awlt2q639zzojdubjff9qinv2uucvxtqvdzxg1rasq1aguzdjx');

    if (!idPadre || !token_sesion) {
      setInitializing(false);
      return;
    }

    try {
      const response = await fetch(
        `http://aplicacionescolar.com/webview/php/verificar_sesion.php?id_padre=${idPadre}&token_sesion=${token_sesion}`
      );
      const data = await response.json();

      if (data.status === 'success') {
        navigation.navigate('DetallesAlumno');
      } else {
        setInitializing(false);
      }
    } catch {
      setInitializing(false);
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  const handleBarCodeRead = async (rawValue: string) => {
    if (scanSuccessful) return;

    try {
      const existingToken = await AsyncStorage.getItem('@token_sesion');
      if (existingToken) {
        navigation.navigate('DetallesAlumno');
        return;
      }

      let formData = new FormData();
      formData.append('accion', 'iniciar_sesion_qr');
      formData.append('codigo_qr', rawValue);

      const response = await fetch(`http://aplicacionescolar.com/webview/php/padre.php`, {
        method: 'POST',
        body: formData,
      });

      const apiData = await response.json();

      if (apiData.status === 'success') {
        await AsyncStorage.setItem('@idPadre', apiData.id_padre);
        await AsyncStorage.setItem('@token_sesion', apiData.token_sesion);

        setScanSuccessful(true);
        await requestNotificationPermission();
        navigation.navigate('DetallesAlumno');
      } else {
        Alert.alert("El código no existe o hay un error");
      }
    } catch (error) {
      console.error('Error en login QR:', error);
    }
  };

  if (initializing) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.largeText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Escanea tu código QR para ingresar</Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          cameraType="back"
          scanBarcode={true}
          onReadCode={(event) => handleBarCodeRead(event.nativeEvent.codeStringValue)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Al escanear el código usted está de acuerdo con nuestros términos y condiciones.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('login_qr_escuelas')}
          style={styles.button}
        >
          <View style={styles.buttonCenter}>
            <Text style={styles.buttonText}>Scanner Escuelas</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D6EFD',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: windowWidth,
    height: 350,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D6EFD',
  },
  largeText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#42b2a1',
    width: 250,
    marginTop: 15,
    paddingVertical: 8,
  },
  buttonCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginNativa;
