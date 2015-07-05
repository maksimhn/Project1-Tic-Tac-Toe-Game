var cleanBoard = {
  a: null,
  b: null,
  c: null,
  d: null,
  e: null,
  f: null,
  g: null,
  h: null,
  i: null
};

var currentBoard = {
  a: null,
  b: null,
  c: null,
  d: null,
  e: null,
  f: null,
  g: null,
  h: null,
  i: null
};


var getWinner = function () {
  if (winnerIs('x')) {
    return 'x';
  }
  if (winnerIs('o')) {
    return 'o';
  }
  return null;
};

var winnerIs = function (player) {
  return winsRow(player) || winsColumn(player) || winsDiagonal(player);
};

var winsRow = function (player) {
  return allThree(player, currentBoard.a, currentBoard.b, currentBoard.c) ||
         allThree(player, currentBoard.d, currentBoard.e, currentBoard.f) ||
         allThree(player, currentBoard.g, currentBoard.h, currentBoard.i);
};

var winsColumn = function (player) {
  return allThree(player, currentBoard.a, currentBoard.d, currentBoard.g) ||
         allThree(player, currentBoard.b, currentBoard.e, currentBoard.h) ||
         allThree(player, currentBoard.c, currentBoard.f, currentBoard.i);
};

var winsDiagonal = function (player) {
  return allThree(player, currentBoard.a, currentBoard.e, currentBoard.i) ||
         allThree(player, currentBoard.c, currentBoard.e, currentBoard.g);
};

var allThree = function (player, cellOne, cellTwo, cellThree) {
  return (cellOne === player) && (cellTwo === player) && (cellThree === player);
};

var isItTie = function () {
  for (cell in currentBoard) {
    if (currentBoard.cell !== null) {

    }
  }
};

var nextMove = function (player, move) {
  currentBoard[move] = player;
  if (getWinner(player) === 'x') {
    return console.log('x has won');
  } else if (getWinner(player) === 'o') {
    return console.log('o has won');
  }
  return null;
};

var nextTurn = function () {

};

$(function() {
  $('#start').click(function() {
    $('.activeframe').toggleClass('activeframe-down');
    $('.playersnames').toggleClass('playersnames-shown');
  });
});

$(function() {
  $('#play').click(function() {
    $('.activeframe').toggleClass('activeframe-down');
    $('.playersnames').toggleClass('playersnames-shown');
  });
});
