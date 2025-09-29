import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';


export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [products, setProducts] = useState([]);

  const db = SQLite.openDatabaseSync('shoppinglistdb');

  const initialize = async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS shoppinglist (id INTEGER PRIMARY KEY NOT NULL, product TEXT, amount TEXT);
    `);
      await updateList(); // Load existing data
    } catch (error) {
      console.error('Could not open database', error);
    }
  }

  useEffect(() => { initialize() }, []);

  const saveProduct = async () => {
    try {
      await db.runAsync('INSERT INTO shoppinglist (product, amount) VALUES (?, ?)', product, amount);
      await updateList(); // Update the list after saving
      setProduct(''); // Clear input fields
      setAmount('');
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from shoppinglist');
      setProducts(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    try {
      await db.runAsync('DELETE FROM shoppinglist WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={product => setProduct(product)}
        value={product}
        placeholder='Product'
      />
      <TextInput
        style={styles.input}
        onChangeText={amount => setAmount(amount)}
        value={amount}
        placeholder='Amount'
      />

      <Button title='Save' onPress={saveProduct} />
      <FlatList
        ListHeaderComponent={<Text style={styles.header}>Shopping List</Text>}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.item}>
            <Text>{item.product},</Text>
            <Text> {item.amount} </Text>
            <Text style={{ color: '#ff0000' }} onPress={() => deleteItem(item.id)}> bought</Text>
          </View>
        }
        data={products}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
  },
});
