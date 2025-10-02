import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Obtiene el objeto de navegación

  const verificarSesion = async () => {
    try {
      const id_escuela = await AsyncStorage.getItem('@id_escuela');
      const scannerSesion = await AsyncStorage.getItem('@scannerSesion');

      if(scannerSesion == 'scanner'){
          const response = await fetch('http://aplicacionescolar.com/sistema/php/usuario.php?id_escuela=' + id_escuela + '&accion=verificar_sesion_scanner', {
          method: 'GET',
        });

        const data = await response.json();

        if (data.status === 'success') {
          // La sesión está activa y es válida
          navigation.navigate('scannerEscuelas'); // Reemplaza 'PantallaDespuesDeLogin' con el nombre de tu pantalla de destino
        }
      }
      
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    }
  };

  const handleLogin = async () => {
    //navigation.navigate('scannerEscuelas'); // Reemplaza 'PantallaDespuesDeLogin' con el nombre de tu pantalla de destino
    
    let formData = new FormData();
    formData.append('accion', 'iniciar_sesion_qr_escuelas');
    formData.append('email', email);
    formData.append('password', password);

    const response = await fetch(`http://aplicacionescolar.com/sistema/php/usuario.php`, {
      method: 'POST',
      body: formData,
    });
    
    const apiData = await response.json();

    if (apiData.status === 'success') {
      await AsyncStorage.setItem('@id_escuela', apiData.id_escuela);
      await AsyncStorage.setItem('@id_usuario', apiData.id_usuario);
      await AsyncStorage.setItem('@scannerSesion', 'scanner');
      navigation.navigate('scannerEscuelas'); // Reemplaza 'PantallaDespuesDeLogin' con el nombre de tu pantalla de destino
      //const id_escuela = await AsyncStorage.getItem('@id_escuela');

      //console.log('id_escuela:', id_escuela);
    } else {
      Alert.alert("El usuario no existe o hay un error");
    }
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Text style={styles.label}>Constraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'grey'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'grey'
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    color: 'grey'
  }
});

export default LoginScreen;
