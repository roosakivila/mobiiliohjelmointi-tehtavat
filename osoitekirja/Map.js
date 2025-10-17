import { Appbar, Button, PaperProvider } from "react-native-paper";
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from "react-native";

export default function Map({ route, navigation }) {

  const { fetchedCoordinates, region, address, onSave } = route.params;

  const handleSave = () => {
    onSave({
      address: address,
      coordinates: fetchedCoordinates
    });
    navigation.goBack();
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}>
          {fetchedCoordinates.latitude && fetchedCoordinates.longitude && (
            <Marker
              coordinate={{
                latitude: fetchedCoordinates.latitude,
                longitude: fetchedCoordinates.longitude
              }}
            />
          )}
        </MapView>
        <View style={styles.buttonContainer}>
          <Button mode='contained' icon="content-save-outline" onPress={handleSave}>
            Save
          </Button>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});