// App.js

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text
} from 'react-native';

// 1. Usa la variable de entorno pública de Expo (EXPO_PUBLIC_*) con fallback a la DEMO_KEY
const NASA_API_KEY = process.env.EXPO_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

export default function App() {
  // Estados para manejar los datos, el estado de carga y los errores
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los datos de la API
  const fetchApod = async () => {
    setLoading(true); // Inicia la carga
    setError(null);   // Limpia errores previos

    // 2. Bloque try-catch para manejar errores en la petición
    try {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
      const response = await axios.get(url);
      setApodData(response.data); // Guarda los datos en el estado
    } catch (err) {
      // 3. Manejo de errores específicos (401, 404, etc.)
      if (err.response) {
        if (err.response.status === 401) {
          setError('Error 401: La API Key es incorrecta o no autorizada.');
        } else if (err.response.status === 404) {
          setError('Error 404: No se encontró el recurso en la API.');
        } else {
          setError(`Error del servidor: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Error de red: No se pudo conectar a la API de la NASA.');
      } else {
        setError(`Error inesperado: ${err.message}`);
      }
    } finally {
      setLoading(false); // Termina la carga, tanto si hubo éxito como si hubo error
    }
  };

  // useEffect se ejecuta una vez cuando el componente se monta
  useEffect(() => {
    fetchApod();
  }, []); // El array vacío asegura que solo se ejecute una vez al inicio

  // --- Renderizado del componente ---

  // Si está cargando, muestra un indicador de actividad
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0b3d91" />
        <Text style={styles.loadingText}>Cargando imagen del día...</Text>
      </SafeAreaView>
    );
  }

  // Si hay un error, muestra el mensaje de error y un botón para reintentar
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Houston, tenemos un problema Houston, we have a problem Houston, we have a problem Houston, we have a problemHouston, we have a problemHouston, we have a problemHouston, we have a problem Houston, we have a problemHouston, we have a problem🚀</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={fetchApod} color="#0b3d91" />
      </SafeAreaView>
    );
  }

  // 4. Si todo salió bien, muestra los datos de forma ordenada
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{apodData.title}</Text>
        <Text style={styles.date}>{apodData.date}</Text>

        {/* La API a veces devuelve un video, comprobamos el tipo de medio */}
        {apodData.media_type === 'image' ? (
          <Image source={{ uri: apodData.url }} style={styles.image} />
        ) : (
          <Text style={styles.mediaNotice}>El contenido de hoy es un video, no se puede mostrar aquí.</Text>
        )}
        
        <Text style={styles.explanationTitle}>Explicación:</Text>
        <Text style={styles.explanation}>{apodData.explanation}</Text>
        
        {apodData.copyright && (
          <Text style={styles.copyright}>© {apodData.copyright}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos para la aplicación ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  container: { // Para centrar carga y error
    flex: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#c9d1d9',
    fontSize: 16,
  },
  errorText: {
    color: '#f85149',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c9d1d9',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#8b949e',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Mantiene la proporción cuadrada, ajusta si es necesario
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#30363d',
  },
  mediaNotice: {
    color: '#8b949e',
    marginVertical: 40,
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c9d1d9',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 16,
    color: '#c9d1d9',
    lineHeight: 24,
    textAlign: 'justify',
  },
  copyright: {
    marginTop: 20,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#8b949e',
  },
});