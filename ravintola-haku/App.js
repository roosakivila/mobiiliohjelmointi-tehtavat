import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useState } from 'react';


export default function App() {

  const apikey = '68c9067b1785b343785221fdr2e8d8f';
  const restaurantApikey = 'da04f058d1634c49b5a2a0798291e3bf';

  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  })
  const [address, setAddress] = useState('');
  const [fetchedCoordinates, setFetchedCoordinates] = useState({
    latitude: null,
    longitude: null
  });
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAddress = () => {
    setLoading(true);
    const url = `https://geocode.maps.co/search?q=${address}&api_key=${apikey}`;
    fetch(url)
      .then(response => {
        if (!response.ok)
          throw new Error('Error in fetch: ' + response.statusText);

        return response.json()
      })
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          setFetchedCoordinates({ latitude: lat, longitude: lon });

          setRegion({
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          });

          fetchRestaurants(lon, lat);
        } else {
          console.warn('No results found');
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err)
        setLoading(false);
      });
  }

  const fetchRestaurants = (longitude, latitude) => {
    const url = `https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${longitude},${latitude},2000&limit=20&apiKey=${restaurantApikey}`;
    fetch(url)
      .then(response => {
        if (!response.ok)
          throw new Error('Error in fetch: ' + response.statusText);

        return response.json()
      })
      .then(data => {
        setRestaurants(data.features);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}>

          {restaurants && (
            restaurants.map((place) =>
              <Marker
                key={place.properties.place_id}
                coordinate={{
                  latitude: place.geometry.coordinates[1],
                  longitude: place.geometry.coordinates[0]
                }}
                title={place.properties.name}
                description={place.properties.address_line2}
              />
            ))}
        </MapView>
        <View style={styles.controls}>
          <TextInput
            style={styles.input}
            placeholder='Syötä osoite'
            value={address}
            onChangeText={text => setAddress(text)}
          />
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            title="Etsi"
            onPress={fetchAddress}
            disabled={loading}
          ><Text style={styles.buttonText}>{loading ? 'LADATAAN...' : 'NÄYTÄ'}</Text></Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  controls: {
    width: '100%',
    padding: 10,
  },
  input: {
    fontSize: 18,
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});



