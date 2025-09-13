import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {

  const [fetchedRates, setFetchedRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [toEuros, setToEuros] = useState(0);

  let myHeaders = new Headers();
  myHeaders.append("apikey", "f4DDMhlC3mKyVYdGkK1iKyjrb4VSpQBw");

  let requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  useEffect(() => {
    fetch(
      "https://api.apilayer.com/exchangerates_data/latest?symbols=GBP,JPY,USD&base=EUR",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in fetch: " + response.statusText);
        }
        return response.json();
      })
      .then(data => setFetchedRates(data.rates))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    console.log('Fetched rates:', fetchedRates);
    console.log('Keys:', Object.keys(fetchedRates));
  }, [fetchedRates]);

  const calculateToEuros = () => {
    if (amount && selectedCurrency && fetchedRates[selectedCurrency]) {
      const rate = fetchedRates[selectedCurrency];
      const amountNumber = parseFloat(amount);
      if (!isNaN(amountNumber) && amountNumber > 0) {
        const convertedToEuros = amountNumber / rate;
        setToEuros(convertedToEuros.toFixed(2));
        setAmount('');
      } else {
        setToEuros('0.00');
      }
    } else {
      setToEuros('0.00');
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={{ width: 150, height: 150, marginBottom: 20 }}
        source={require('./assets/euro-155597_640.png')}
      />
      <Text style={styles.answer}>{toEuros} €</Text>
      <View style={styles.pickView}>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={text => setAmount(text)}
          placeholder="Enter amount"
          keyboardType='numeric'
        />

        <Picker
          style={styles.picker}
          selectedValue={selectedCurrency}
          onValueChange={(value) => {
            console.log('Picker value changed to:', value);
            setSelectedCurrency(value);
          }}
        >
          {Object.keys(fetchedRates).map((currency) => (
            <Picker.Item
              key={currency}
              label={currency}
              value={currency}
            />
          ))}
        </Picker>
      </View>
      <Button title="Convert" onPress={calculateToEuros} />
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
    borderBottomWidth: 0.8,
    margin: 10,
    width: 100,
  },
  picker: {
    height: 50,
    width: 100,
  },
  pickView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  answer: {
    fontSize: 20,
    margin: 10,
    fontWeight: 'bold',
  }
});
