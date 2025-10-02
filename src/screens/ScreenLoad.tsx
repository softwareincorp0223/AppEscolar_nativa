import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ScreenLoad = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginNativa'); // <-- Cambia al nombre real de tu screen
    }, 2000); // 2 segundos de carga

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={{
            uri: 'https://ik.imagekit.io/softwareincorp/Asset%202-8.png?updatedAt=1757634423341',
        }}
        style={styles.logo}
        resizeMode="contain"
        />

      {/* Loader */}
      <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D6EFD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});

export default ScreenLoad;
