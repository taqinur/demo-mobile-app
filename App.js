import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import Weather from './components/weather';
import { API_KEY } from './utils/ApiKey';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [screen, setScreen] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }

      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      fetchWeather(latitude, longitude);
    } catch (error) {
      console.log('Error getting location', error);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log('Error fetching weather data', error);
    }
  };

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching The Weather</Text>
        </View>
      </View>
    );
  }

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  const weatherCondition = weatherData.weather[0].main;
  const temperature = weatherData.main.temp;

  function toggle(){
    setScreen(!screen);
  }

  function toggleCameraType() {
    setType(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  }

  if (!screen) {
    return (
    
    <View style={styles.container}>
      <Weather weather={weatherCondition} temperature={temperature} />
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggle}>
            <Text style={styles.text}>Open Camera</Text>
          </TouchableOpacity>
      </View>
    </View>
    
  )
  }

  if(screen){
    return(
      <View style={styles.container}>
          <Camera style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggle}>
                <Text style={styles.text}>Weather Info</Text>
              </TouchableOpacity>
            </View>
          </Camera>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4',
  },
  loadingText: {
    fontSize: 30,
  },
  errorText: {
    fontSize: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});
