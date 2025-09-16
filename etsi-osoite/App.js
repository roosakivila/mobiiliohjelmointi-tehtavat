import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';


export default function App() {

  const apikey = '68c9067b1785b343785221fdr2e8d8f';

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

const fetchAddress = () => {
  const url = `https://geocode.maps.co/search?q=${address}&api_key=${apikey}`;
  fetch(url)
  .then(response => { 
    if(!response.ok)
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
        } else {
          console.warn('No results found');
        }
  })
  .catch(err => console.error(err));
}



  return (
      <KeyboardAvoidingView
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <View style={styles.container}>
      <MapView
      style={styles.map} 
      region={region}> 

      {fetchedCoordinates.latitude && fetchedCoordinates.longitude && (
      <Marker
      coordinate={{
      latitude: fetchedCoordinates.latitude, 
      longitude: fetchedCoordinates.longitude}}
      />
      )}
      </MapView>
      <View style={styles.controls}>
      <TextInput
      style={styles.input}
      placeholder='Syötä osoite'
      value={region}
      onChangeText={text => setAddress(text)} 
      />
      <Pressable
      style={styles.button}
      title="Etsi"
      onPress={fetchAddress}
       ><Text style={styles.buttonText}>NÄYTÄ</Text></Pressable>
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
});

