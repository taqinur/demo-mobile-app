import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import * as Location from 'expo-location';
import Weather from './components/weather';
import { API_KEY } from './utils/ApiKey';

  export default function App() {

    const [weatherData, setWeatherData] = useState(null);

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

  const weatherCondition = weatherData.weather[0].main;
  const temperature = weatherData.main.temp;

  return (
    <View style={styles.container}>
      <Weather weather={weatherCondition} temperature={temperature} />
    </View>
  );
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
});
