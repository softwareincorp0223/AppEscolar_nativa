import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifee from '@notifee/react-native';
import { Platform } from 'react-native';

/* ----------------------- 1. Guardar token en tu BD ----------------------- */
const saveTokenToServer = async (token: string) => {
  const idPadre = await AsyncStorage.getItem('@idPadre');
  if (!idPadre) return console.log('No hay idPadre en AsyncStorage');

  const formData = new FormData();
  formData.append('token', token);
  formData.append('accion', 'registrar_dispositivo');
  formData.append('id_padre', idPadre);

  await fetch('http://aplicacionescolar.com/sistema/php/padre.php', {
    method: 'POST',
    body: formData,
  });
};

/* ------------------- 2. Obtener y registrar token del device ------------- */
const registerDeviceToken = async () => {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  await saveTokenToServer(token);
};

/* --------------------- 3. Manejo de contador de badge -------------------- */
const incrementBadge = async () => {
  let count = parseInt(await AsyncStorage.getItem('@contadorNotificaciones') || '0');
  count++;
  await AsyncStorage.setItem('@contadorNotificaciones', count.toString());
  await Notifee.setBadgeCount(count);
};

/* ------------------------ 4. Escuchar notificaciones --------------------- */
const listenToNotifications = () => {
  // App abierta (foreground)
  messaging().onMessage(async remoteMessage => {
    console.log('Notificación en foreground:', remoteMessage);

    await Notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Nuevo mensaje',
      body: remoteMessage.notification?.body || 'Tienes una nueva notificación',
      android: {
        channelId: 'default',
        smallIcon: 'ic_notification', // ícono correcto
      },
    });

    await incrementBadge();
  });

  // App en background o cerrada
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Notificación en background:', remoteMessage);

    await Notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Nuevo mensaje',
      body: remoteMessage.notification?.body || 'Tienes una nueva notificación',
      android: {
        channelId: 'default',
        smallIcon: 'ic_notification',
      },
    });

    await incrementBadge();
  });
};

/* -------------------- 5. Solicitar permisos y arrancar ------------------- */
export const initNotifications = async () => {
  const auth = await messaging().requestPermission();
  if (auth === messaging.AuthorizationStatus.AUTHORIZED || auth === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('Permiso de notificaciones concedido');
    await registerDeviceToken();
    listenToNotifications();
  } else {
    console.log('Permiso denegado');
  }
};
