const readline = require('readline');

const rdln = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("                                       ");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("~~~~~~~~~~~~~~~~~~ Welcome to Anti-Chess ~~~~~~~~~~~~~~~~~~");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("                                       ");

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

let activePlayer = 'White';


function showBoard() {
  console.log('__|_A_B_C_D_E_F_G_H'); 
  board.forEach((row, i) => {
    console.log((8 - i) + ' | ' + row.join(' ')); 
  });
}



// Check for the similarity of the target piece with the player's piece who has the turn
function isOpponentPiece(piece, activePlayer) {
  return (activePlayer === 'White' && piece === piece.toLowerCase()) || (activePlayer === 'Black' && piece === piece.toUpperCase());
}

function checkLegalMove(move) {
  const [from, to] = move.split(' ');
  const fromCol = from.charCodeAt(0) - 'A'.charCodeAt(0);
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 'A'.charCodeAt(0);
  const toRow = 8 - parseInt(to[1]);
  
  const piece = board[fromRow][fromCol];

  // Check for place if it's empty and if the place is holding the piece according to the player
  if (piece === EMPTY && (activePlayer === 'White' && piece === piece.toLowerCase()) && (activePlayer === 'Black' && piece === piece.toUpperCase())) {
      return false;
  }
   // Check for the target position whether it's empty and if it contains a piece of the same player who's turn in active
   switch (piece.toUpperCase()) {
    case 'P': return checkLegalPawnMove(fromRow, fromCol, toRow, toCol, activePlayer);
    case 'R': return checkLegalRookMove(fromRow, fromCol, toRow, toCol, activePlayer);
    case 'B': return checkLegalBishopMove(fromRow, fromCol, toRow, toCol, activePlayer);
    case 'N': return checkLegalKnightMove(fromRow, fromCol, toRow, toCol, activePlayer);
    case 'Q': return checkLegalQueenMove(fromRow, fromCol, toRow, toCol, activePlayer);
    case 'K': return checkLegalKingMove(fromRow, fromCol, toRow, toCol, activePlayer);
    default: return false;
  }
}

function checkLegalPawnMove(fromRow, fromCol, toRow, toCol, player) {
  const direction = player === 'White' ? -1 : 1;  
  const startRow = player === 'White' ? 6 : 1;  


  // Forward move (non-capturing)
  if (fromCol === toCol) {
      if (board[toRow][toCol] === EMPTY) {  // Check if the target square is empty
          console.log(fromRow);
          console.log(startRow);
          if (fromRow === startRow && fromRow + 2 * direction === toRow) {
              return true;                 
          }
          // Regular single move forward
          if (fromRow + direction === toRow) {
              return true;                 
          }
      }else{
          return false;                    
      }
  }
  // Capture move (diagonal)
  if (Math.abs(fromCol - toCol) === 1 && fromRow + direction === toRow && !isOpponentPiece(board[toRow][toCol], player)) {
      return true;                         
  }

  return false;                            
}

function checkLegalRookMove(fromRow, fromCol, toRow, toCol, activePlayer) {
  // Rooks can move either horizontally or vertically, but not both simultaneously
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;                          
  }
  // Horizontal move check
  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;   
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (board[fromRow][col] !== EMPTY) {
        return false;                        
      }
    }
  } else {  // Vertical move check
    const step = fromRow < toRow ? 1 : -1;   
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (board[row][fromCol] !== EMPTY) {
        return false;                        
      }
    }
  }
  // Final check: ensure that the destination square either is empty or contains an opponent's piece
  return !isOpponentPiece(board[toRow][toCol], activePlayer);
}

function checkLegalBishopMove(fromRow, fromCol, toRow, toCol, activePlayer) {
  // Check if the move is diagonal (both row and column distances are equal)
  if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
    return false;                       
  }
  
  // Determine the direction of movement along rows and columns
  const rowStep = fromRow < toRow ? 1 : -1;  
  const colStep = fromCol < toCol ? 1 : -1;  

  // Check all squares between start and destination for obstacles (pieces)
  for (let row = fromRow + rowStep, col = fromCol + colStep; row !== toRow; row += rowStep, col += colStep) {
    if (board[row][col] !== EMPTY) {
        return false;                   
      }
    }
  
  return board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], activePlayer);
}

function checkLegalKnightMove(fromRow, fromCol, toRow, toCol, activePlayer) {
  // Calculate the absolute differences in rows and columns
  const dRow = Math.abs(fromRow - toRow);
  const dCol = Math.abs(fromCol - toCol);

  // Knights move in an 'L' shape: two squares in one direction and one square perpendicular
  if((dRow === 2 && dCol === 1) || (dRow === 1 && dCol === 2)){
    return board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], activePlayer);;
  }

  return false;
}

function checkLegalQueenMove(fromRow, fromCol, toRow, toCol, activePlayer) {
  // Queen moves are Legal if they follow either rook or bishop movement rules
  return checkLegalRookMove(fromRow, fromCol, toRow, toCol, activePlayer) || checkLegalBishopMove(fromRow, fromCol, toRow, toCol, activePlayer);
}

function checkLegalKingMove(fromRow, fromCol, toRow, toCol, activePlayer) {
  // Kings can move one square in any direction
  return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1 && board[toRow][toCol] === EMPTY || !isOpponentPiece(board[toRow][toCol], activePlayer);
}


function makeMove(move) {
  const [from, to] = move.split(' ');
  const fromCol = from.charCodeAt(0) - 'A'.charCodeAt(0);
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 'A'.charCodeAt(0);
  const toRow = 8 - parseInt(to[1]);
  
  if (checkLegalMove(move)) {
    const piece = board[fromRow][fromCol];
    board[fromRow][fromCol] = EMPTY;
    board[toRow][toCol] = piece;
    activePlayer = activePlayer === 'White' ? 'Black' : 'White';
  } else {
    console.log('Legal move. Try again.');  
  }
}

function pickColor(piece) {
  return  activePlayer === 'White' ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
}

function checkWinner(){
  // If there's at least one piece of the current player's color, return false (game continues)
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] !== EMPTY && pickColor(board[i][j])){
        return false;   
      }
    }
  }

  return true; 
}



function getNextMove() {
  console.log("                                       ");
  rdln.question(`${activePlayer}'s move (e.g., A2 A3), 'quit' to end or 'display' to see moves: `, (input) => {
    // Check if the player wants to quit the game
    if (input === 'quit') {
      console.log(`${activePlayer === 'White' ? 'Black' : 'White'} wins!`);
      rdln.close();
      return;
    }

    // Check if the current player has no Legal moves left, indicating the opponent wins
    if(checkWinner()){
      console.log(`${activePlayer} wins!`);
      rdln.close();
      return;
    }
    
    // Display the current state of the board
    if (input.toLowerCase() === 'display') {
      showBoard();
    } else {
      makeMove(input);
    }
    
    getNextMove();
  });
  console.log("                                       ");
}

// Function to start the game
function startGame() {
  showBoard();
  getNextMove();
}

// Start the game when this script is executed
startGame();