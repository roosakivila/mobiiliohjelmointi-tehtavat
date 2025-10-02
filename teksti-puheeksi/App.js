import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import SegmentedControl from '@react-native-segmented-control/segmented-control';


export default function App() {

const [language, setLanguage] = useState(0);
const [thingToSay, setThingToSay] = useState("");

const languages = ['en', 'fi', 'sv']; 

 const speak = () => {
    Speech.speak(thingToSay, { language: languages[language] });
  };

  return (
    <View style={styles.container}>
       <SegmentedControl
       style={styles.languages}
        values={['English', 'Finnish', 'Swedish']}
        selectedIndex={language}
        onChange={(event) => {
          setLanguage(event.nativeEvent.selectedSegmentIndex);
           }}
  />
      <TextInput
            style={styles.input}
            placeholder='Type something here...'
            value={thingToSay}
            onChangeText={thingToSay => setThingToSay(thingToSay)}
       />
      <Button title="Say it" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
    marginTop: 20,
    padding: 8,
  },
  languages: {
    width: 300,
  }
});
