
var player, move, turnCount, playerToken;
var currentTurn = '';
var cleanBoard = ["","","","","","","","",""];
var currentBoard = ["","","","","","","","",""];

var getWinner = function () {
  console.log(currentBoard);
  if (winnerIs('x')) {
    return 'x';
  } else if (winnerIs('o')) {
    return 'o';
  }
  for (var i = 0; i < currentBoard.length; i++) {
    if (currentBoard[i] !== '') {
      return 'draw'
    }
  }
  return null;
};

// updates the local version of the board with the one sent by server
var boardRender = function (board) {
  for (var i = 0; i < board.length; i++) {
    $('#cell' + i).text(board[i]);
  }
};

var game = function() {

};

// block of functions to determine if there is a winner
var winnerIs = function (player) {
  return winsRow(player) || winsColumn(player) || winsDiagonal(player);
};
var winsRow = function (player) {
  return allThree(player, currentBoard[0], currentBoard[1], currentBoard[2]) ||
         allThree(player, currentBoard[3], currentBoard[4], currentBoard[5]) ||
         allThree(player, currentBoard[6], currentBoard[7], currentBoard[8]);
};
var winsColumn = function (player) {
  return allThree(player, currentBoard[0], currentBoard[3], currentBoard[6]) ||
         allThree(player, currentBoard[1], currentBoard[4], currentBoard[7]) ||
         allThree(player, currentBoard[2], currentBoard[5], currentBoard[8]);
};
var winsDiagonal = function (player) {
  return allThree(player, currentBoard[0], currentBoard[4], currentBoard[8]) ||
         allThree(player, currentBoard[2], currentBoard[4], currentBoard[6]);
};
var allThree = function (player, cellOne, cellTwo, cellThree) {
  return (cellOne === player) && (cellTwo === player) && (cellThree === player);
};






// $(function() {
//   $('#start').click(function() {
//     $('.activeframe').toggleClass('activeframe-down');
//     $('.playersnames').toggleClass('playersnames-shown');
//   });
// });

// $(function() {
//   $('#play').click(function() {
//     $('.activeframe').toggleClass('activeframe-down');
//     $('.playersnames').toggleClass('playersnames-shown');
//   });
// });

