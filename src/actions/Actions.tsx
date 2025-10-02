import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Linking
} from 'react-native';

export const marcarVisto = async (archivo, idAlumno) => {

    let datos = new FormData();
    datos.append("accion", "marcar_visto");
    datos.append("id_hijo", idAlumno);

    try {
        const response = await fetch(`http://aplicacionescolar.com/sistema/php/${archivo}`, {
            method: 'POST',
            body: datos,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        
        return apiData;
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        throw error; // O maneja el error de la forma que necesites
    }
};

export const handleSeleccionarHijo = async () => {
    const idAlumno = await AsyncStorage.getItem('@idAlumno');

    let formData = new FormData();
    formData.append("accion", "consulta");
    formData.append("id_modificar", idAlumno);
    formData.append("detalles", 'detalles');

    const response = await fetch(`http://aplicacionescolar.com/sistema/php/alumno.php`, {
        method: 'POST',
        body: formData,
    });

    const apiData = await response.json();
};

export const handlePadre = async () => {
    const idPadre = await AsyncStorage.getItem('@idPadre');
    console.log(idPadre);

    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);

    items.forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
    });

    let datosPadre = new FormData(); // Crea un objeto FormData con los datos del formulario
    datosPadre.append("accion", "consulta");
    datosPadre.append("id_modificar", idPadre);
    datosPadre.append("detalles", "detalles");

    const responsePadre = await fetch(`http://aplicacionescolar.com/sistema/php/padre.php`, {
        method: 'POST',
        body: datosPadre,
    });

    const apiDataPadre = await responsePadre.json();

    await AsyncStorage.setItem('@nombre_padre', apiDataPadre.fila[0].nombre);
    await AsyncStorage.setItem('@apellido_padre', apiDataPadre.fila[0].apellido);
    await AsyncStorage.setItem('@correo_padre', apiDataPadre.fila[0].correo);

    console.log('apiDataPadre.fila');
    console.log(apiDataPadre.fila);
};

export const handleInstituto = async () => {
    const idInstituto = await AsyncStorage.getItem('@idInstituto');
    console.log(idInstituto);

    let datos = new FormData(); // Crea un objeto FormData con los datos del formulario
    datos.append("accion", "consulta");
    datos.append("id_modificar", idInstituto);
    datos.append("detalles", "detalles");

    const response = await fetch(`http://aplicacionescolar.com/sistema/php/instituto.php`, {
        method: 'POST',
        body: datos,
    });

    const apiData = await response.json();

    await AsyncStorage.setItem('@logo_instituto', apiData.fila[0].logo);
    await AsyncStorage.setItem('@nombre_instituto', apiData.fila[0].nombre);
    await AsyncStorage.setItem('@correo_instituto', apiData.fila[0].correo);
    await AsyncStorage.setItem('@descripcion_instituto', apiData.fila[0].descripcion);

    console.log('apiData.fila');
    console.log(apiData.fila);
};

export const notificaciones_dentro_app = async () => {
    try {
        const id_alumno = await AsyncStorage.getItem('@idAlumno');
        
        let datos = new FormData(); // Crea un objeto FormData con los datos del formulario
        datos.append("accion", "notificaciones_dentro_app_nativa");
        datos.append("id_alumno", id_alumno);

        const response = await fetch(`http://aplicacionescolar.com/sistema/php/alumno.php`, {
            method: 'POST',
            body: datos,
        });

        if (!response.ok) { // Verifica si la respuesta no es "ok"
            throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const apiData = await response.json();

        // Aquí puedes hacer algo con apiData, por ejemplo, devolverlo o procesarlo
        console.log(apiData);
        
        const newNotifications = {
            Mensajes: apiData.numero_datos_mensajes > 0,
            Tareas: apiData.numero_datos_tareas > 0,
            Seguimientos: apiData.numero_datos_seguimientos > 0,
            Calificaciones: apiData.numero_datos_evaluaciones > 0,
            Calendario: apiData.numero_datos_eventos > 0,
            Asistencias: apiData.numero_datos_asistencias > 0,
            Configuracion: false,
        };

        console.log("newNotifications")
        console.log(newNotifications)
        return newNotifications;

    } catch (error) {
        console.error('Error:', error);
        // Maneja el error según sea necesario
    }
};