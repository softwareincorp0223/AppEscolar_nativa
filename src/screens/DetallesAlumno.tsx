// src/screens/detallesAlumno.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../../navigation/AppNavigator';
import Alumnos from '../components/Alumnos';

// Definimos los tipos de props basados en tu navegación
type Props = NativeStackScreenProps<RootStackParamList, 'DetallesAlumno'>;

interface Alumno {
  id_alumno: string;
  nombre: string;
  mensajes_no_leidos?: number;
  // Agrega aquí más propiedades si tu API devuelve otras
}

const DetallesAlumno: React.FC<Props> = ({ navigation }) => {
  const [alumnosData, setAlumnosData] = useState<Alumno[]>([]);

  // Redirección a la pantalla de Mensajes
  const handleRedirect = () => {
    navigation.navigate('Mensajes');
  };

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const idPadre = await AsyncStorage.getItem('@idPadre');
        if (!idPadre) return;

        const formData = new FormData();
        formData.append('accion', 'buscar_hijos_app');
        formData.append('id_padre', idPadre);

        const response = await fetch(
          'http://aplicacionescolar.com/webview/php/consultar_hijo.php',
          {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        const apiData = await response.json();
        if (apiData?.fila) {
          console.log('📌 Alumnos data:', apiData.fila);
          setAlumnosData(apiData.fila);
        }
      } catch (error) {
        console.error('❌ Error al cargar alumnos:', error);
      }
    };

    fetchAlumnos();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Alumnos data={alumnosData} onRedirect={handleRedirect} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D6EFD',
    padding: 20,
  },
});

export default DetallesAlumno;
