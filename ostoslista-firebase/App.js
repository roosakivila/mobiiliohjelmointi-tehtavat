import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Alert } from 'react-native';
import { app } from './firebaseConfig';
import { getDatabase, ref, push, onValue, remove } from "firebase/database";
import { useState, useEffect } from 'react';


export default function App() {

  const database = getDatabase(app);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsArray = Object.keys(data).map(key => ({
          key: key,
          ...data[key]
        }));
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    })
  }, []);

  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });
  const [items, setItems] = useState([]);

  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, 'items/'), product);
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  }


  const handleDelete = (itemKey) => {
    const itemRef = ref(database, `items/${itemKey}`);
    remove(itemRef)
      .then(() => {
        console.log('Item deleted successfully');
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to delete item');
        console.error('Delete error:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product title'
        onChangeText={text => setProduct({ ...product, title: text })}
        value={product.title} />
      <TextInput
        style={styles.input}
        placeholder='Amount'
        onChangeText={text => setProduct({ ...product, amount: text })}
        value={product.amount} />
      <Button onPress={handleSave} title="Save" />
      <FlatList
        ListHeaderComponent={<Text style={styles.header}>Shopping List</Text>}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text style={{ fontSize: 18 }}>{item.title}, {item.amount}</Text>
            <Text
              style={{ color: '#ff0000', fontSize: 18, marginLeft: 10 }}
              onPress={() => handleDelete(item.key)}
            >
              delete
            </Text>
          </View>}
        data={items} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  input: {
    fontSize: 18,
    width: 200,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
  },
  listcontainer: {
    flexDirection: 'row'
  },
});
