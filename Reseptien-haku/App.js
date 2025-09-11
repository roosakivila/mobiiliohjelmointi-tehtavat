import { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Image, FlatList, Text, Pressable, ActivityIndicator } from 'react-native';


export default function App() {

  const [keyword, setKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=`;

  const fetchRecipes = () => {
    setLoading(true);

    fetch(`${url}${keyword.toLowerCase()}`)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);

        return response.json()
      })
      .then(data => setRecipes(data.meals))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
}

return (
  <View style={styles.container}>
    <TextInput
      style={styles.input}
      placeholder='keyword'
      value={keyword}
      onChangeText={text => setKeyword(text)}
    />
    <Pressable style={styles.button}
      title="Find" onPress={fetchRecipes}>
      <Text style={styles.buttonText}>FIND</Text>
    </Pressable>
    
     {loading && <ActivityIndicator size="large" />}

    <FlatList
      data={recipes}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => <View style={styles.recipesView}>
        <Text style={{ fontSize: 18 }}>
          {item.strMeal}
        </Text>
        <Image
          style={{ width: 150, height: 150 }}
          source={{ uri: item.strMealThumb }}
        />
      </View>}
    />
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
  },
  button: {
    backgroundColor: '#2196F3',
    width: 200,
    paddingHorizontal: 70,
    paddingVertical: 8,
    marginTop: 10,
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    width: 200,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginHorizontal: 50,
  },
  recipesView: {
    marginLeft: 50,
    marginRight: 50,

  }
});
