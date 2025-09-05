import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function History({ route }) {

    const { history } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History</Text>
            <FlatList
                data={history}
                renderItem={({ item }) => <Text style={styles.historyText}>{item}</Text>}
                style={styles.historyList}>
            </FlatList>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    historyList: {
        height: 50,
        width: '80%',
        marginTop: 10,
    },
    historyText: {
        fontSize: 15,
        textAlign: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    }
});