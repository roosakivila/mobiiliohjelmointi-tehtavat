import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';


export default function App() {

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState('');

  const handleAdd = () => {
    const sum = parseFloat(number1) + parseFloat(number2);
    setResult(sum.toString());
  }

  const handleSubtract = () => {
    const sub = parseFloat(number1) - parseFloat(number2);
    setResult(sub.toString());
  }
  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
  },
  input: {
    height: 40,
    width: 80,
    margin: 12,
    borderBlockColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
});
