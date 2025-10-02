import React, { useEffect, useRef, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import Notifee from '@notifee/react-native'; // Importa Notifee desde @notifee/react-native
import { 
  Platform,
} from 'react-native';

// Llamar a AsyncStorage para obtener el ID del padre
const obtenerIdPadreYGuardarToken = async (token) => {
    try {
      const idPadre = await AsyncStorage.getItem('@idPadre');

      if (idPadre !== null) {
        // Llamar a la función para guardar el token en la base de datos junto con el ID del padre
        await guardarTokenEnBD(token, idPadre);
        //await guardarSesionEnBD(idPadre);
      } else {
        console.log('ID del Padre no disponible');
      }
    } catch (error) {
      console.error('Error al obtener el ID del Padre:', error);
    }
  };

  const guardarTokenEnBD = async (token, idPadre) => {
    try {
      const formData = new FormData();
      formData.append('token', token);
      formData.append('accion', 'registrar_dispositivo');
  
      // Agregar el ID del padre al formData si está disponible
      if (idPadre) {
        formData.append('id_padre', idPadre);
      }

      const response = await fetch('http://aplicacionescolar.com/sistema/php/padre.php', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } catch (error) {
      console.error('Error al enviar el token al servidor:', error);
    }
  };

  // Actualizar el contador del badge
  const updateBadgeCount = async () => {
    try {
      if (Platform.OS === 'ios') {
        // iOS utiliza UIApplication para manejar el contador del badge
        Notifee.setBadgeCount(1).then(() => console.log('Badge count set!'));
      } else if (Platform.OS === 'android') {
        // Android utiliza NotificationManager para manejar el contador del badge
        Notifee.setBadgeCount(1).then(() => console.log('Badge count set!'));

        /*Notifee
          .incrementBadgeCount(3)
          .then(() => Notifee.getBadgeCount())
          .then(count => console.log('Badge count incremented by 3 to: ', count));*/
      }
    } catch (error) {
      console.error('Error al establecer el contador del badge:', error);
    }
  };

  // Función para obtener el contador de notificaciones almacenado localmente
  const obtenerContadorNotificaciones = async () => {
    try {
        const contador = await AsyncStorage.getItem('@contadorNotificaciones');
        return contador ? parseInt(contador) : 0;
      } catch (error) {
        console.error('Error al obtener el contador de notificaciones:', error);
        return 0;
    }
  };

  // Función para incrementar el contador de notificaciones
  const incrementarContadorNotificaciones = async () => {
    try {
        let contador = await obtenerContadorNotificaciones();
        contador++;
        console.log("contador real");
        console.log(contador);
        updateBadgeCount(); // Establecer el contador del badge en 8
        await AsyncStorage.setItem('@contadorNotificaciones', contador.toString());
    } catch (error) {
        console.error('Error al incrementar el contador de notificaciones:', error);
    }
  };

  const handleNotifications = () => {
    const getToken = async () => {
        try {
          const token = await messaging().getToken();
          console.log('Device Token:', token);
          // Guardar el token en la base de datos usando la API POST en PHP
          await obtenerIdPadreYGuardarToken(token);
        } catch (error) {
          console.error('Error al obtener el token:', error);
        }
    };

  const handleForegroundNotification = async () => {
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
      // Aquí puedes manejar la notificación mientras la aplicación está en primer plano
      // Incrementar el número del badge al recibir una notificación
      await incrementarContadorNotificaciones();
    });
  };

  const handleBackgroundNotification = async () => {
    /*messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background Notification:', remoteMessage);
      // Aquí puedes manejar la notificación mientras la aplicación está en segundo plano o cerrada
      // Incrementar el número del badge al recibir una notificación
      await incrementarContadorNotificaciones();
    });*/
    // Your app's background handler for incoming remote messages
    messaging().setBackgroundMessageHandler(async (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage
    ) => {
      console.log('Background Notification:', remoteMessage);
      // Increment the count by 1
      //await Notifee.incrementBadgeCount();
      await incrementarContadorNotificaciones();
    })
  };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await getToken();
      handleForegroundNotification();
      handleBackgroundNotification();
    }
  };

  // Solicitar permiso y configurar manejadores de notificaciones
  /*useEffect(() => {
    requestPermission();
    handleForegroundNotification();
    handleBackgroundNotification();
  }, []);

  // Restablecer el contador de notificaciones al iniciar la aplicación
  useEffect(() => {
      const resetContador = async () => {
          await AsyncStorage.setItem('@contadorNotificaciones', '0');
      };
      resetContador();
  }, []);*/

  requestPermission();
};

export default handleNotifications;
