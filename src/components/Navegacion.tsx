// src/components/Menu.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCalendarAlt,
  faStar,
  faCog,
  faMessage,
  faFaceSmile,
  faList,
  faAddressBook,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  currentScreen: string;
  navigation: {
    navigate: (screen: string) => void;
  };
  onReload?: () => void;
  notifications: { [key: string]: boolean };
}

const Menu: React.FC<Props> = ({ currentScreen, navigation, onReload, notifications }) => {
  const handlePress = (screen: string) => {
    navigation.navigate(screen);
    if (onReload) onReload();
  };

  const menuItems = [
    { screen: 'Mensajes', icon: faMessage, label: 'Mensajes' },
    { screen: 'Tareas', icon: faList, label: 'Tareas' },
    { screen: 'Seguimientos', icon: faFaceSmile, label: 'Seguimientos' },
    { screen: 'Calificaciones', icon: faStar, label: 'Calificaciones' },
    { screen: 'Calendario', icon: faCalendarAlt, label: 'Calendario' },
    { screen: 'Asistencias', icon: faAddressBook, label: 'Asistencias' },
    { screen: 'Configuracion', icon: faCog, label: 'Configuración' },
  ];

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      
      <View style={styles.menuContainer}>
        {menuItems.map(({ screen, icon, label }) => (
          <TouchableOpacity
            key={screen}
            style={styles.button}
            onPress={() => handlePress(screen)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={icon} size={18} color="#fff" />
              {notifications[screen] && <View style={styles.notificationDot} /> }
            </View>
            {currentScreen === screen && <Text style={styles.buttonText}>{label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0d6efd',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 8,
    backgroundColor: '#0d6efd',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -4,
    right: -8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#fff',
  },
});

export default Menu;
