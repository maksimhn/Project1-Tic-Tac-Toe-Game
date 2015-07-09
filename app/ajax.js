var playOnline = function() {
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
};

// updates a game with a move made
var moveHandler = function (e) {
  $.ajax(sa + '/games/' + $('#id').val(), {
    contentType: 'application/json',
    processData: false,
    data: JSON.stringify({
      game: {
        cell: {
          index: lastMove,
          value: lastPlayer
        }
      },
      over: isGameOver
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
};

var joinGame = function(e) {
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
};


var getList = function(e) {
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
};


var showGame = function() {
  event.preventDefault();
  this.blur();
  $.ajax(sa + '/games/' + $('#gameid').val(), {
    dataType: 'json',
    method: 'GET',
    headers: {
      Authorization: 'Token token=' + playerToken
    }
  }).done(function(data, textStatus, jqxhr){
    currentBoard = date['game']['cells'];
    boardRender(currentBoard);
    $('#result').val(JSON.stringify(data)); // Make it shown on the board
    boardRender(data.game.cells);
  }).fail(function(jqxhr, textStatus, errorThrown){
    $('#result').val('show failed');
  });
};

var startGame = function () {
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
};


var signIn = function() {
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
    toggleElements();
  }).fail(function(jqxhr, textStatus, errorThrown){
    $('#result').val('login failed');
  });
  $('#email').val('');
  $('#password').val('');
};


var registerPlayer = function () {
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
};