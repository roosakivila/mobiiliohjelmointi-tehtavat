import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Places from './Places';
import Map from './Map';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Places" component={Places}/>
        <Stack.Screen name="Map" component={Map}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


