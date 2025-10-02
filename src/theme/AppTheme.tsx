import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    globalMargin:{
        marginHorizontal: 20
    },
    /*configuracion estilos*/
    headerConfiguracion: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        left: 0,
        right: 0,
        //backgroundColor: '#258DFE',
        height: 250
    },
    titleConfiguracion:{
        fontSize: 23,
        color: 'white',
        fontWeight: 'bold',
        top: 10
    },
    containerDatosConfiguracion:{
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        margin: 20,
        padding: 20,
        top: -130,
    },
    datosPadre:{
        top: -110,
        height: 190,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoEscuela: {
        width: 150,
        height: 150,
        borderRadius: 150,
        top: -60,
    },
    textoPadre: {
        top: -40,
        fontSize: 16
    },
    infoConfiguracion:{
        fontSize: 17,
        color: '#0d6efd',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    infoConfiguracionText: {
        fontWeight: 'bold',
        fontSize: 14,
        margin: 1
    },
    infoConfiguracionTextData: {
        fontWeight: 'normal',
    },
    cerrarSesion: {
        textAlign: 'center',
    },
    /*configuracion estilos*/
    cajaTituloSeccion: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 15,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.6,
        shadowRadius: 7,
    },
    cajaTituloSeccionText: {
        color: '#0d6efd',
        fontSize: 23,
    },
    textoGris: {
        color: '#212529',
    },
});