// screens/MenuScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  const [difficulty, setDifficulty] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.subtitle}>Select Difficulty</Text>

      <View style={styles.buttonGroup}>
        <Button title="Easy" onPress={() => setDifficulty(0)} color={difficulty === 0 ? '#2196f3' : '#aaa'} />
        <Button title="Hard" onPress={() => setDifficulty(1)} color={difficulty === 1 ? '#2196f3' : '#aaa'} />
        <Button title="Expert" onPress={() => setDifficulty(2)} color={difficulty === 2 ? '#2196f3' : '#aaa'} />
      </View>

      <View style={{ marginTop: 32 }}>
        <Button title="Start Game" onPress={() => navigation.navigate('Game', { difficulty })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32 },
  subtitle: { fontSize: 18, marginBottom: 16 },
  buttonGroup: { width: '80%', gap: 12 },
});
