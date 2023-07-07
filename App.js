import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


// import { DangerZone } from 'expo';
// const { Lottie } = DangerZone;

import { API_KEY } from './utils/ApiKey';

import Weather from './components/weather';

export default class App extends React.Component {
  state = {
    isLoading: true,
    temperature: 0,
    weatherCondition: null,
    error: null
  };

  componentDidMount() {
    this.fetchWeather();

    // Geolocation.getCurrentPosition(
    //   (position) => {
    //     this.fetchWeather(position.coords.latitude, position.coords.longitude);
    //   },
    //   (error) => {
    //     this.setState({
    //       error: 'Error Getting Weather Condtions'
    //     },
    //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //     );
    //   }
    // );
  }


  // componentDidMount() {
  //   console.log('sfdaskj');
    
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(position);
  //       },
  //       (error) => {
  //         console.log(error.code, error.message);
  //       },
  //       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //     );
    
  // }

  fetchWeather(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=23.1104&lon=90.4125&appid=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        // console.log(json);
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          isLoading: false
        });
      });
  }

  render() {
    const { isLoading, weatherCondition, temperature } = this.state;
    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching The Weather</Text>
          </View>
        ) : (
          <Weather weather={weatherCondition} temperature={temperature} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDE4'
  },
  loadingText: {
    fontSize: 30
  }
});