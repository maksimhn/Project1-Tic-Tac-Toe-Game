
//jQuery.ajax
$(function(){
var gameWatcher;
  'use strict';
//  var sa = '//localhost:3000';
//  var sa = 'https://young-citadel-2431.herokuapp.com';
// var sa = 'http://10.13.108.54:3000';
var sa = 'https://young-citadel-2431.herokuapp.com';
var player, move, turnCount, playerToken;
var currentTurn = '';
//var cleanBoard = ["","","","","","","","",""];
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

// updates the current board state after player's move
var boardReader = function (cellID, player) {
  currentBoard[$(this).val().charAt(4)] = player;
};

var game = function() {
  while (!getWinner) {

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
  });

  $('#signin').on('click', function(e) {
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
      $('#result').val(data.token);
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('login failed');
    });
  });













  $('#list').on('click', function(e) {
    $.ajax(sa + '/games', {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('list failed');
    });
  });

  $('#create').on('click', function(e) {
    $.ajax(sa + '/games', {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({}),
      dataType: 'json',
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('create failed');
    });
  });


  $('#show').on('click', function(e) {
    $.ajax(sa + '/games/' + $('#id').val(), {
      dataType: 'json',
      method: 'GET',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('show failed');
    });
  });

  $('#join').on('click', function(e) {
    $.ajax(sa + '/games/' + $('#id').val(), {
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({}),
      dataType: 'json',
      method: 'PATCH',
      headers: {
        Authorization: 'Token token=' + $('#token').val()
      }
    }).done(function(data, textStatus, jqxhr){
      $('#result').val(JSON.stringify(data));
    }).fail(function(jqxhr, textStatus, errorThrown){
      $('#result').val('join failed');
    });
  });

  $('#move').on('click', function(e) {
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

});
