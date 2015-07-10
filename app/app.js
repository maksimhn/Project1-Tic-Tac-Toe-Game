
var gameWatcher;
'use strict';
var sa = 'https://young-citadel-2431.herokuapp.com';
var player, move, lastMove, lastPlayer, playerToken;
var isGameOver = false;
var xScore = 0;
var oScore = 0;
var currentBoard = ["","","","","","","","",""];

// determines a winner based on current state of the board, changes state of the game tracker's value and prevents future clicks on the board
var getWinner = function () {
  if (winnerIs('x')) {
    isGameOver = true;
    xScore++;
    scoreRender(xScore, oScore);
    boardBlocker('.boardcells');
    return alert('Congrats, Player X! You are the winner');
  } else if (winnerIs('o')) {
    isGameOver = true;
    oScore++;
    scoreRender(xScore, oScore);
    boardBlocker('.boardcells');
    return alert('Congrats, Player O! You are the winner');
  }
  if (whoseMoveIsIt(currentBoard) === 'full') {
    boardBlocker('.boardcells');
    isGameOver = true;
    return alert('It\'s a draw!');
  }
};

// updates the local version of the board with the one sent by server
var boardRender = function (board) {
  for (var i = 0; i < board.length; i++) {
    $('#cell' + i).text(board[i]);
    if (board[i]) {
      boardBlocker('#cell' + i);
    }
  }
};

// updates players' scores
var scoreRender = function(scoreX, scoreO) {
  $('#scorex').html('<h5>Player X:</h5>');
  $('#scoreo').html('<h5>Player O:</h5>');
  $('#scorex').append('<text>' + xScore + '</text>');
  $('#scoreo').append('<text>' + oScore + '</text>');
};

// prevents future clicks and hover effects
var boardBlocker = function(element) {
  $(element).unbind('click', clickHandler);
  $(element).removeClass('hovereffect');
};

// unlocks the board for the next game
var boardUnblocker = function(board) {
  for (var i = 0; i < board.length; i++) {
    $('#cell' + i).bind('click', clickHandler);
    $('#cell' + i).addClass('hovereffect');
  }
};

// determines whose move is next based on the state of the board
var whoseMoveIsIt = function (board) {
  var turnCount = 0;
  for (var i = 0; i < board.length; i++) {
    if (board[i]) {
      turnCount++;
    }
  }
  if (turnCount === 9) {
    return 'full';
  } else if (turnCount % 2 !== 0) {
    return 'o';
  } else {
    return 'x';
  }
};


// block of functions that determine if there is a winner
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

// updates currentBoard array and rerenders the board upon a new move
var clickHandler = function(e) {
  var cellIndex = +$(this).attr('id').charAt(4);
  lastMove = cellIndex;
  currentBoard[cellIndex] = whoseMoveIsIt(currentBoard);
  lastPlayer = whoseMoveIsIt(currentBoard);
  boardRender(currentBoard);
  moveSender();
  return getWinner();
};

// var datafortest = {
//   "games": [
//     {
//       "id": 1,
//       "cells": ["o","x","o","x","o","x","o","x","o"],
//       "over": true,
//       "player_x": {
//         "id": 1,
//         "email": "and@and.com"
//       },
//       "player_o": {
//         "id": 3,
//         "email": "dna@dna.com"
//       }
//     },
//     {
//       "id": 2,
//       "cells": ["","","","","","","","",""],
//       "over": false,
//       "player_x": {
//         "id": 3,
//         "email": "dna@dna.com"
//       },
//       "player_o": {
//         "id": 1,
//         "email": "and@and.com"
//       }
//     }
//   ]
// };

// adds a list of games played to the dropdown field below the button
var listMaker = function(data) {
  var finalList = '<ol>';
  var gamesArray = data['games'];
  //$('#listarea').html('<h4>piu</h4>');
  for (var i = 0; i < gamesArray.length; i++) {
    finalList += '<li><text>Game id: ' + gamesArray[i]['id'] + ', is over: ' + gamesArray[i]['over'] + ', ' + gamesArray[i]['player_x']['email'] + ' is X, ' + gamesArray[i]['player_o']['email'] + ' is O' + '</text></li>';
  }
  return finalList + '</ol>';
};

// toggles visibility of Logout and List buttons
var toggleElements = function () {
  if (!playerToken) {
    $('#register').removeClass('hider');
    $('#signin').removeClass('hider');
    $('#passwordfield').show();
    $('#emailfield').show();
    $('#online').addClass('hider');
    $('#logout').addClass('hider');
    $('#ortext').show();
  } else {
    $('#register').addClass('hider');
    $('#signin').addClass('hider');
    $('#ortext').hide();
    $('#passwordfield').hide();
    $('#emailfield').hide();
    $('#online').removeClass('hider');
    $('#logout').removeClass('hider');
    $('#listnew').removeClass('hider');
    $('#ortext').removeClass('hider');
  }
};

