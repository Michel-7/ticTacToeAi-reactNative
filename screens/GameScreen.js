// screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  checkWinner,
  randomAIMove,
  getBestMove,
  getBestMoveAlphaBeta
} from '../logic/gameLogic';

const emptyBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', ''],
];

export default function GameScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { difficulty } = route.params;

  const [board, setBoard] = useState(emptyBoard);
  const [gameOver, setGameOver] = useState(false);
  const [winnerLine, setWinnerLine] = useState(null);

  const makeAIMove = (newBoard) => {
    let move = null;

    if (difficulty === 0) move = randomAIMove(newBoard);
    else if (difficulty === 1) move = getBestMove(newBoard);
    else if (difficulty === 2) move = getBestMoveAlphaBeta(newBoard);

    if (move) {
      const [i, j] = move;
      const updated = newBoard.map(row => [...row]);
      updated[i][j] = 'X';
      setBoard(updated);
    }
  };

  const handlePlayerMove = async (i, j) => {
    if (board[i][j] !== '' || gameOver) return;

    const newBoard = board.map(row => [...row]);
    newBoard[i][j] = 'O';
    setBoard(newBoard);
  };

  useEffect(() => {
  const result = checkWinner(board);

  if (result) {
    setGameOver(true);
    if (result.winner === 'draw') {
      Alert.alert('Game Over', 'It\'s a draw!');
    } else {
      setWinnerLine(result.line);
      Alert.alert('Game Over', `Winner: ${result.winner}`);
    }

    setTimeout(() => {
      navigation.navigate('Menu');
    }, 1500);
    return;
  }

  const flatBoard = board.flat();
  const countO = flatBoard.filter(cell => cell === 'O').length;
  const countX = flatBoard.filter(cell => cell === 'X').length;

  if (!gameOver && countO > countX) {
    const timer = setTimeout(() => {
      makeAIMove(board);
    }, 500);
    return () => clearTimeout(timer);
  }
}, [board]);


  const handleRestart = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
    setGameOver(false);
    setWinnerLine(null);
  };

  const isWinningCell = (i, j) => {
    return winnerLine?.some(([x, y]) => x === i && y === j);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  isWinningCell(rowIndex, colIndex) && styles.winningCell
                ]}
                onPress={() => handlePlayerMove(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Button title="Restart" onPress={handleRestart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  grid: { marginBottom: 32 },
  row: { flexDirection: 'row' },
  cell: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  cellText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  winningCell: {
    backgroundColor: '#90ee90',
  },
});
