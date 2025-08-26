import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {

  const [buy, setBuy] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  const handleAdd = () => {
    const toBuy = buy;
    setShoppingList([...shoppingList, toBuy]);
    setBuy("");
  }

  const handleClear = () => {
    setShoppingList([]);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={buy => setBuy(buy)}
        value={buy}
        placeholder='Remember to buy...'
      />
      <View style={styles.button}>
      <Button title='ADD' onPress={handleAdd} />
      <Button title='CLEAR' onPress={handleClear} />
      </View>
      <Text style={styles.title}>Shopping List</Text>
      <FlatList
        data={shoppingList}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    marginTop: 50,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'blue',
    paddingTop: 30,
  }
});
