import { useState, useEffect } from "react";
import { PaperProvider, TextInput, Text, Button, List, Dialog, Portal } from "react-native-paper";
import { FlatList, StyleSheet, View } from "react-native";
import * as SQLite from 'expo-sqlite';


export default function Places({ navigation }) {

  const db = SQLite.openDatabaseSync('places.db');

  const updateList = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM places');
      const placesFromDb = result.map(row => ({
        id: row.id,
        address: row.address,
        coordinates: {
          latitude: row.latitude,
          longitude: row.longitude
        }
      }));
      setPlaces(placesFromDb);
    } catch (error) {
      console.error('Error loading places:', error);
    }
  };

  const initialize = async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS places (
        id TEXT PRIMARY KEY NOT NULL, 
        address TEXT NOT NULL, 
        latitude REAL NOT NULL, 
        longitude REAL NOT NULL
      );
    `);
      await updateList();
    } catch (error) {
      console.error('Could not open database', error);
    }
  };

  useEffect(() => {
    initialize();
  }, []);


  const [addressInput, setAddressInput] = useState("");
  const [fetchedCoordinates, setFetchedCoordinates] = useState({
    latitude: null,
    longitude: null
  });
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const showDialog = (item) => {
    setSelectedItem(item);
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
    setSelectedItem(null);
  };

  const apikey = '68c9067b1785b343785221fdr2e8d8f';


  const fetchCoordinates = () => {
    const url = `https://geocode.maps.co/search?q=${addressInput}&api_key=${apikey}`;
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

          const newCoordinates = { latitude: lat, longitude: lon };
          const newRegion = {
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          };

          setFetchedCoordinates(newCoordinates);
          setRegion(newRegion);

          navigation.navigate('Map', {
            fetchedCoordinates: newCoordinates,
            region: newRegion,
            address: addressInput,
            onSave: savePlace
          });
        } else {
          console.warn('No results found');
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  const savePlace = async (placeData) => {
    try {
      const newPlace = {
        id: Date.now().toString(),
        address: placeData.address,
        coordinates: placeData.coordinates
      };

      await db.runAsync(
        'INSERT INTO places (id, address, latitude, longitude) VALUES (?, ?, ?, ?)',
        [newPlace.id, newPlace.address, newPlace.coordinates.latitude, newPlace.coordinates.longitude]
      );

      setPlaces([...places, newPlace]);
    } catch (error) {
      console.error('Error saving place:', error);
    }
  }

  const deletePlace = async (id) => {
    try {
      await db.runAsync('DELETE FROM places WHERE id = ?', [id]);
      hideDialog();
      setPlaces(places.filter(place => place.id !== id));
    } catch (error) {
      console.error('Error deleting place:', error);
      hideDialog();
    }
  }

  return (
    <PaperProvider>
      <Text variant="titleSmall" style={styles.header}>Placefinder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          mode='outlined'
          onChangeText={setAddressInput}
          value={addressInput}
          label='Type in address'
          style={styles.textInput}
        />
        <Button
          mode='contained'
          icon="content-save-outline"
          onPress={fetchCoordinates}
          style={styles.showButton}
        >
          Show
        </Button>
      </View>
      <FlatList
        data={places}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          <List.Item
            title={item.address}
            description={'Show on map'}
            onPress={() => navigation.navigate('Map', {
              address: item.address,
              fetchedCoordinates: item.coordinates,
              region: {
                latitude: item.coordinates.latitude,
                longitude: item.coordinates.longitude,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0221,
              }
            })}
            onLongPress={() => showDialog(item)}
          />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Are you sure?</Dialog.Title>
          <Dialog.Content>
            <Text>Do you really want to delete this item?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={() => deletePlace(selectedItem.id)}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#ccc',
  },
  textInput: {
    marginHorizontal: 5,
  },
  showButton: {
    alignSelf: 'center',
    width: 200,
    marginVertical: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    marginTop: 16,
    marginLeft: 16,
  }
});
