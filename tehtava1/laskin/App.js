import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { useState } from 'react';


export default function App() {

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const handleAdd = () => {
    const sum = parseFloat(number1) + parseFloat(number2);
    setResult(sum.toString());
    const historyString = `${number1} + ${number2} = ${sum}`;
    setHistory([...history, historyString]);
    setNumber1('');
    setNumber2('');
  }

  const handleSubtract = () => {
    const sub = parseFloat(number1) - parseFloat(number2);
    setResult(sub.toString());
    const historyString = `${number1} - ${number2} = ${sub}`;
    setHistory([...history, historyString]);
    setNumber1('');
    setNumber2('');
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result: {result}</Text>
      <TextInput
        style={styles.input}
        onChangeText={number1 => setNumber1(number1)}
        value={number1}
        keyboardType="numeric" />
      <TextInput
        style={styles.input}
        onChangeText={number2 => setNumber2(number2)}
        value={number2}
        keyboardType="numeric" />
      <View styles={styles.container} style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="+" onPress={handleAdd} />
        <Button title="-" onPress={handleSubtract} />
      </View>
      <Text style={styles.title}>History</Text>
      <FlatList
        data={history}
        renderItem={({ item }) => <Text style={styles.historyText}>{item}</Text>}
        style={styles.historyList}>
      </FlatList>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 80,
    margin: 12,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
  historyList: {
    height: 50,
    width: '80%',
    marginTop: 10,
  },
  historyText: {
    textAlign: 'center'
  },
title: {
  fontWeight: 'bold',
  fontSize: 15,
  paddingTop: 50,
}
});
