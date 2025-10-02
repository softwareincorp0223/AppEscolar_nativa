import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, BackHandler, Platform, TouchableOpacity, Modal, Linking } from 'react-native';
import { Camera } from 'react-native-camera-kit';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ScanerEscuelas = () => {
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const [isActionTaken, setIsActionTaken] = useState(false);
  const [alumno, setAlumnoNombre] = useState('');
  const [matricula, setAlumnoMatricula] = useState('');

  async function notificaciones(id, archivo) {
    try {
        const notificacion_info = new FormData();
        notificacion_info.append('id', id);

        const response = await fetch('http://aplicacionescolar.com/sistema/php/notificaciones/' + archivo, {
            method: 'POST',
            body: notificacion_info,
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const responseData = await response.text();
        console.log(responseData);
    } catch (error) {
        console.error('Error:', error);
    }
  }

  const handleBarCodeRead = async (data: string ) => {
    try {
      if (!isActionTaken) {
        setIsActionTaken(true); // Marcar que se ha tomado una acción
        const id_usuario = await AsyncStorage.getItem('@id_usuario');

        let formData = new FormData();
        formData.append('accion', 'insertar');
        formData.append('codigo_qr', data);
        formData.append('id_usuario', id_usuario);
        
        const response = await fetch(`http://aplicacionescolar.com/sistema/php/scanner.php`, {
          method: 'POST',
          body: formData,
        });
        
        const apiData = await response.json();
        console.log(apiData);
        console.log('alumno');
        console.log(apiData.datos[0].nombre);

        if (apiData.respuesta === 'alta') {
          Alert.alert("Código escaneado con éxito.");
          setAlumnoNombre( apiData.datos[0].nombre + " " + apiData.datos[0].apellido );
          setAlumnoMatricula( apiData.datos[0].matricula );
          notificaciones(apiData.id_alumno, 'notificacion_asistencia.php')
          // Aquí puedes realizar cualquier acción adicional necesaria después del escaneo exitoso
        } else {
          Alert.alert("El código no existe o hay un error");
        }

        // Esperar 2 segundos antes de permitir otra acción
        setTimeout(() => {
          setIsActionTaken(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    navigation.navigate('LoginNativa');

    await AsyncStorage.setItem('@id_escuela', '');
    await AsyncStorage.setItem('@scannerSesion', '');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Escanear código QR del alumno</Text>
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
        <View>
          <Text  style={styles.alumnoInfo}>
            {alumno ? "Alumno: " + alumno : 'Escanea un alunmo'}
          </Text>
          <Text  style={styles.alumnoInfo}>
            {matricula ? "Matrícula: " + matricula : ''}
          </Text>
        </View>
        <TouchableOpacity
            onPress={handleLogout}
            style={styles.button}
        >
          <View style={styles.buttonCenter}>
              <Text style={styles.buttonText}>Cerrar Sesión y Escáner</Text>
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
    backgroundColor: '#42b2a1',
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
  buttonText: {
    fontSize: 15,
    marginTop: 10,
    top: -5,
    color: 'white',
    marginStart: 7,
    textAlign: 'center'
  },
  button: {
      fontSize: 15,
      borderRadius: 5,
      borderWidth: 1, 
      borderColor: 'white',
      alignContent: 'center',
      width: 250,
      top: 15
  },
  buttonCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingVertical: 5,
  },
  alumnoInfo: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'
  },
});

export default ScanerEscuelas;
