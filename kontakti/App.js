import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useState } from 'react';

export default function App() {

  const [contacts, setContacts] = useState([]);

const getContacts = async () => {
  const {status} = await Contacts.requestPermissionsAsync();
  if (status === 'granted') {
    const {data} = await Contacts.getContactsAsync(
      { fields: [Contacts.Fields.PhoneNumbers]}
    );

    if(data.length > 0) {
      setContacts(data);
    }
    else {
      Alert.alert("Warning", "No contacts found");
    }
  }
}

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
      {contacts.map((contact) => (
        <Text key={contact.id}>{contact.name} {contact.phoneNumbers?.[0]?.number || "No number"}</Text>
      ))}
      </ScrollView>
      <View style={styles.button}>
      <Button title='Get Contacts' onPress={getContacts}/>
      </View>
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
  scroll: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 40,
  },
  button: {
    marginBottom: 50,
  },
});
