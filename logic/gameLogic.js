// logic/gameLogic.js
const cloneBoard = (board) => board.map(row => [...row]);

export const getAvailableMoves = (board) => {
  const moves = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === '') {
        moves.push([i, j]);
      }
    });
  });
  return moves;
};

export const checkWinner = (board) => {
  const lines = [
    // Rows
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // Columns
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // Diagonals
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const cellA = board[a[0]][a[1]];
    const cellB = board[b[0]][b[1]];
    const cellC = board[c[0]][c[1]];
    if (cellA !== '' && cellA === cellB && cellA === cellC) {
      return { winner: cellA, line };
    }
  }

  if (getAvailableMoves(board).length === 0) {
    return { winner: 'draw' };
  }

  return null;
};

export const randomAIMove = (board) => {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
};

const minimax = (board, isMaximizing) => {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'X') return 1;
    if (result.winner === 'O') return -1;
    return 0;
  }

  const moves = getAvailableMoves(board);
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const [i, j] of moves) {
    board[i][j] = isMaximizing ? 'X' : 'O';
    const score = minimax(board, !isMaximizing);
    board[i][j] = '';
    bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
  }

  return bestScore;
};

export const getBestMove = (board) => {
  let bestScore = -Infinity;
  let move = null;

  for (const [i, j] of getAvailableMoves(board)) {
    board[i][j] = 'X';
    const score = minimax(board, false);
    board[i][j] = '';
    if (score > bestScore) {
      bestScore = score;
      move = [i, j];
    }
  }

  return move;
};

const alphabeta = (board, depth, alpha, beta, isMaximizing) => {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === 'X') return 1;
    if (result.winner === 'O') return -1;
    return 0;
  }

  const moves = getAvailableMoves(board);
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [i, j] of moves) {
      board[i][j] = 'X';
      const evalScore = alphabeta(board, depth + 1, alpha, beta, false);
      board[i][j] = '';
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [i, j] of moves) {
      board[i][j] = 'O';
      const evalScore = alphabeta(board, depth + 1, alpha, beta, true);
      board[i][j] = '';
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMoveAlphaBeta = (board) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (const [i, j] of getAvailableMoves(board)) {
    board[i][j] = 'X';
    const score = alphabeta(board, 0, -Infinity, Infinity, false);
    board[i][j] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMove = [i, j];
    }
  }

  return bestMove;
};
