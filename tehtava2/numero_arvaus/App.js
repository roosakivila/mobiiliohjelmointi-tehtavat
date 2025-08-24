import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [guess, setGuess] = useState("");
  const [text, setText] = useState("Guess a number between 1-100");
  const [count, setCount] = useState(0);
  const [randomNumber, setRandomNumber] = useState(() => Math.floor(Math.random() * 100) + 1);

  const handleGuess = () => {
    const numericGuess = parseFloat(guess);

    // Validate input
    if (isNaN(numericGuess) || guess.trim() === "") {
      setText("Please enter a valid number");
      return;
    }

    const newCount = count + 1;
    setCount(newCount);

    if (numericGuess > randomNumber) {
      setText(`Your guess ${guess} is too high`);
    } else if (numericGuess < randomNumber) {
      setText(`Your guess ${guess} is too low`);
    } else {
      Alert.alert(`You guessed the number in ${newCount} guesses!`);
    }

    setGuess("");
  };


  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setGuess}
        value={guess}
        keyboardType="numeric"
      />
      <Button title="Make guess" onPress={handleGuess} />

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
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
  },
});
