const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const EMPTY = ' ';


let board = [
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // Changed to lowercase for black pieces
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']  // Changed to lowercase for black pieces
];

let currentPlayer = 'White';

function displayBoard() {
  console.log('  | A B C D E F G H');
  //console.log('|_');
  board.forEach((row, i) => {
    console.log((8 - i) + ' | ' + row.join(' '));
  });
}


// check if the target piece is same as the player's piece who has the turn
function isOpponentPiece(piece, currentPlayer) {
  return (currentPlayer === 'White' && piece === piece.toLowerCase()) || (currentPlayer === 'Black' && piece === piece.toUpperCase());
}

function isLegalMove(move) {
  const [from, to] = move.split(' ');
  const fromCol = from.charCodeAt(0) - 'A'.charCodeAt(0);
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 'A'.charCodeAt(0);
  const toRow = 8 - parseInt(to[1]);
  
  const piece = board[fromRow][fromCol];
  // const target = board[toRow][toCol];

  //Check if the place is empty and if the place is holding the piece according to the player
  if (piece === EMPTY && (currentPlayer === 'White' && piece === piece.toLowerCase()) && (currentPlayer === 'Black' && piece === piece.toUpperCase())) {
      return false;
  }
   //Check if target position is not empty and if the target position contains a piece of the same player who's turn in active
   switch (piece.toUpperCase()) {
    case 'P':
        return isLegalPawnMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    case 'R':
        return isLegalRookMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    case 'N':
        return isLegalKnightMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    case 'B':
        return isLegalBishopMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    case 'Q':
        return isLegalQueenMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    case 'K':
        return isLegalKingMove(fromRow, fromCol, toRow, toCol, currentPlayer);
    default:
        return false;
  }
}

function isLegalPawnMove(fromRow, fromCol, toRow, toCol, player) {
  const direction = player === 'White' ? -1 : 1;
  const startRow = player === 'White' ? 6 : 1;


  // Move forward
  if (fromCol === toCol) {
      if (board[toRow][toCol] === EMPTY) {
          console.log(fromRow);
          console.log(startRow);
          if (fromRow === startRow && fromRow + 2 * direction === toRow) {
              return true;
          }
          if (fromRow + direction === toRow) {
              return true;
          }
      }else{
          return false;
      }
  }
  // Capture
  if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && !isOpponentPiece(board[toRow][toCol], player)) {
      return true;
  }

  return false;
}

function isLegalRookMove(fromRow, fromCol, toRow, toCol, currentPlayer) {
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (board[fromRow][col] !== EMPTY) {
        return false;
      }
    }
  } else {
    const step = fromRow < toRow ? 1 : -1;
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (board[row][fromCol] !== EMPTY) {
        return false;
      }
    }
  }

  return !isOpponentPiece(board[toRow][toCol], currentPlayer);
}

function isLegalKnightMove(fromRow, fromCol, toRow, toCol, currentPlayer) {
  const dRow = Math.abs(fromRow - toRow);
  const dCol = Math.abs(fromCol - toCol);
  if((dRow === 2 && dCol === 1) || (dRow === 1 && dCol === 2)){
    return board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], currentPlayer);;
  }
  return false;
}

function isLegalBishopMove(fromRow, fromCol, toRow, toCol, currentPlayer) {
  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
    return false;
  }
  
  const rowStep = fromRow < toRow ? 1 : -1;
  const colStep = fromCol < toCol ? 1 : -1;
  for (let row = fromRow + rowStep, col = fromCol + colStep; row !== toRow; row += rowStep, col += colStep) {
    if (board[row][col] !== EMPTY) {
        return false;
      }
    }
    
  return board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], currentPlayer);
}

function isLegalQueenMove(fromRow, fromCol, toRow, toCol, currentPlayer) {
  return isLegalRookMove(fromRow, fromCol, toRow, toCol, currentPlayer) || isLegalBishopMove(fromRow, fromCol, toRow, toCol, currentPlayer);
}

function isLegalKingMove(fromRow, fromCol, toRow, toCol, currentPlayer) {
  return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1 && board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], currentPlayer);
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

function decideColor(piece) {
  return  currentPlayer === 'White' ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
}

function checkWin(){

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] !== EMPTY && decideColor(board[i][j])){
        return false;
      }
    }
  }

  return true;
}



function promptMove() {
  rl.question(`${currentPlayer}'s move (e.g., A2 A3), 'quit' to end or 'display' to see moves: `, (input) => {
    if (input === 'quit') {
      console.log(`${currentPlayer === 'White' ? 'Black' : 'White'} wins!`);
      rl.close();
      return;
    }
 
    if(checkWin()){
      console.log(`${currentPlayer} wins!`);
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