
//jQuery.ajax
//$(function(){ TURN ON AFTERWARDS
var gameWatcher;
'use strict';
var sa = 'https://young-citadel-2431.herokuapp.com';
var player, move, playerToken;
var isGameOver = false;
var xScore = 0;
var oScore = 0;
var currentBoard = ["","","","","","","","",""];

// determines a winner based on current state of the board, changes state of the game tracker's value and prevents future clicks on the board
var getWinner = function () {
  if (winnerIs('x')) {
    isGameOver = true;
    xScore++;
    boardBlocker('.boardcells');
    return alert('Congrats, Player X! You are the winner');
  } else if (winnerIs('o')) {
    isGameOver = true;
    oScore++;
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

// prevents future clicks and hover effects
var boardBlocker = function(element) {
  $(element).unbind('click', clickHandler);
  $(element).removeClass('hovereffect');
};

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

// updates currentBoard array and rerenders the board upon a new move
var clickHandler = function(e) {
  var cellIndex = +$(this).attr('id').charAt(4);
  currentBoard[cellIndex] = whoseMoveIsIt(currentBoard);
  boardRender(currentBoard);
  getWinner();
};

// updates currentBoard array and rerenders the board upon a new move
$('.boardcells').on('click', clickHandler);

$('#collapseExample').on('show.bs.collapse', function(e) {
    $('#listarea').html('');
    $('#listarea').append(listMaker(datafortest));
});

var datafortest = {
  "games": [
    {
      "id": 1,
      "cells": ["o","x","o","x","o","x","o","x","o"],
      "over": true,
      "player_x": {
        "id": 1,
        "email": "and@and.com"
      },
      "player_o": {
        "id": 3,
        "email": "dna@dna.com"
      }
    },
    {
      "id": 2,
      "cells": ["","","","","","","","",""],
      "over": false,
      "player_x": {
        "id": 3,
        "email": "dna@dna.com"
      },
      "player_o": {
        "id": 1,
        "email": "and@and.com"
      }
    }
  ]
};

var listMaker = function(data) {
  var finalList = '<ol>';
  var gamesArray = data['games'];
  //$('#listarea').html('<h4>piu</h4>');
  for (var i = 0; i < gamesArray.length; i++) {
    finalList += '<li><text>Game id: ' + gamesArray[i]['id'] + ', is over: ' + gamesArray[i]['over'] + ', ' + gamesArray[i]['player_x']['email'] + ' played for X, ' + gamesArray[i]['player_o']['email'] + ' played for O' + '</text></li>';
  }
  return finalList + '</ol>';
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



  $('#register').on('click', function(e) {
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/register', {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        credentials: {
          email: $('#email').val(),
          password: $('#password').val(),
          password_confirmation: $('#password').val()
        }
      }),
      dataType: 'json',
      method: 'POST'
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('registration failed');
    });
    $('#email').val('');
    $('#password').val('');
  });

  $('#signin').on('click', function(e) {
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/login', {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        credentials: {
          email: $('#email').val(),
          password: $('#password').val()
        }
      }),
      dataType: 'json',
      method: 'POST'
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(data.token); // to DELETE LATER
      playerToken = data.token;
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('login failed');
    });
    $('#email').val('');
    $('#password').val('');
  });

  $('logout').on('click', function(e) {
     location.reload();
     playerToken = '';
  });

  $('#start').on('click', function(e) {
    currentBoard = ["","","","","","","","",""];
    boardRender(currentBoard);
    boardUnblocker(currentBoard);
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/games', {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({}),
      dataType: 'json',
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + playerToken
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('create failed');
    });
  });



  $('#list').on('click', function(e) {
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/games', {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + playerToken
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data)); // Make a cool list of games
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('list failed');
    });
  });

  $('#show').on('click', function(e) {
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/games/' + $('#gameid').val(), {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + playerToken
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data)); // Make it shown on the board
      boardRender(data.game.cells);
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('show failed');
    });
  });


  $('#join').on('click', function(e) {
    event.preventDefault();
    this.blur();
    $.ajax(sa + '/games/' + $('#gameid').val(), {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({}),
      dataType: 'json',
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + playerToken
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
      boardRender(data.game.cells);
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('join failed');
    });
  });

  $('#move').on('click', function(e) {
    this.blur();
    $.ajax(sa + '/games/' + $('#id').val(), {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        game: {
          cell: {
            index: +$('#index').val(),
            value: $('#value').val()
          }
        }
      }),
      dataType: 'json',
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('move failed');
    });
  });


  $('#watch').on('click', function() {
    gameWatcher = resourceWatcher(sa + '/games/' + $('#id').val() + '/watch', {
        Authorization: 'Token token=' + $('#token').val()
    });
    gameWatcher.on('change', function(data) {
      var parsedData = JSON.parse(data);
      // heroku routers report this as a 503
      // if (data.timeout) { //not an error
      //   game.close();
      //   return console.warn(data.timeout);
      // }
      var gameData = parsedData.game;
      var cell = gameData.cell;
      $('#index').val(cell.index);
      $('#value').val(cell.value);
    });
    gameWatcher.on('error', function(e) {
      console.error('an error occured with the stream', e);
    });
  });

//}); TURN ON AFTERWARDS
