import { StyleSheet, Text, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { Appbar, PaperProvider, TextInput, Button, List, IconButton } from 'react-native-paper';


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
      <PaperProvider>
      <Appbar.Header
      mode='center-aligned'
      >
        <Appbar.Content title="Shopping List" />
      </Appbar.Header>
      <TextInput 
      mode='outlined'
        onChangeText={product => setProduct(product)}
        value={product}
        label='Product'
        style={styles.input}
      />
      <TextInput
      mode='outlined'
        onChangeText={amount => setAmount(amount)}
        value={amount}
        label='Amount'
        style={styles.input}
      />

      <Button mode='contained' icon="content-save-outline" style={styles.button} onPress={saveProduct}>Save</Button>
      <FlatList
       data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
           <List.Item 
            title={item.product}
            description={item.amount}
            right={props => 
             <IconButton 
             {...props}
             icon="delete"
             iconColor="red"
             onPress={() => deleteItem(item.id)}/>}
            /> }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    </PaperProvider>
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
    fontSize: 15,
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
  },
   separator: {
    height: 1,
    backgroundColor: '#ccc',
   },
   button: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
   },
});
