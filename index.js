const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const EMPTY = ' ';
const PAWN = 'P';
const KING = 'K';
const pieces = ['P', 'K', 'R', 'N', 'B', 'Q'];
let board = [
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let currentPlayer = 'White';

function displayBoard() {
  console.log('  A B C D E F G H');
  board.forEach((row, i) => {
    console.log((8 - i) + ' ' + row.join(' '));
  });
}

function isLegalMove(move) {
  // Simplified move legality check, to be expanded
  return true;
}

function makeMove(move) {
  const [from, to] = move.split(' ');
  const fromCol = from.charCodeAt(0) - 'A'.charCodeAt(0);
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 'A'.charCodeAt(0);
  const toRow = 8 - parseInt(to[1]);
  
  if (isLegalMove(move)) {
    const piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = EMPTY;
    board[toRow][toCol] = piece;
    currentPlayer = currentPlayer === 'White' ? 'Black' : 'White';
  } else {
    console.log('Illegal move. Try again.');
  }
}

function promptMove() {
  rl.question(`${currentPlayer}'s move (e.g., A2 A3), 'quit' to end or 'display' to see moves: `, (input) => {
    if (input === 'quit') {
      console.log(`${currentPlayer === 'White' ? 'Black' : 'White'} wins!`);
      rl.close();
      return;
    }
    
    if (input.toLowerCase() === 'display') {
      displayBoard();
    } else {
      makeMove(input);
    }
    
    promptMove();
  });
}

function startGame() {
  displayBoard();
  promptMove();
}

startGame();