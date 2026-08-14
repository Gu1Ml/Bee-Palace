import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>ADHD Task App</Text>
            <Text style={styles.subtitle}>React Native</Text>
            <Text style={styles.description}>Backend conectado e pronto</Text>
          </View>
        </SafeAreaView>
      </PaperProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#2196F3',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});