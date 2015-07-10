//jQuery.ajax

var playOnline = function() {
  gameWatcher = resourceWatcher(sa + '/games/' + $('#gameid').val() + '/watch', {
      Authorization: 'Token token=' + playerToken
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
    currentBoard[cell.index] = cell.value;
    lastMove = cell.index;
    lastPlayer = cell.value;
    boardRender(currentBoard);
    getWinner();
  });
  gameWatcher.on('error', function(e) {
    console.error('an error occured with the stream', e);
  });
};

// updates a game with a move made; sends a new move and the board's state to the server
var moveSender = function (e) {
  $.ajax(sa + '/games/' + $('#gameid').val(), {
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
      Authorization: 'Token token=' + playerToken
    }
  }).done(function(data, textStatus, jqxhr){
    //$('#result').val(JSON.stringify(data));
  }).fail(function(jqxhr, textStatus, errorThrown){
    //$('#result').val('move failed');
  });
};

// sends 'join' request to the server
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
      alert('Joined as O to player ' + data['game']['player_x']['email']);
      //$('#result').val(JSON.stringify(data));
      boardRender(data.game.cells);
    }).fail(function(jqxhr, textStatus, errorThrown){
      alert('Joining failed. Please check game ID');
      //$('#result').val('join failed');
    });
};

// retrieves a list of games associated with user id
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
    $('#listarea').html('');
    $('#listarea').append(listMaker(data));
    // $('#result').val(JSON.stringify(data)); // Make a cool list of games
  }).fail(function(jqxhr, textStatus, errorThrown){
    alert('List retrieval failed. Please check game ID');
    // $('#result').val('list failed');
  });
};

// retrieves a specific game by id and shows it on the board
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
    currentBoard = data['game']['cells'];
    boardRender(currentBoard);
    //$('#result').val(JSON.stringify(data)); // Make it shown on the board
    boardRender(data['game']['cells']);
  }).fail(function(jqxhr, textStatus, errorThrown){
    alert('Game retrieval failed. Please check game ID');
    //$('#result').val('show failed');
  });
};

// starts a new game, renders board blank
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
    //$('#result').val(JSON.stringify(data));
  }).fail(function(jqxhr, textStatus, errorThrown){
    //$('#result').val('create failed');
  });
};

// sends a sign in request; hides unnecessary elements
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
    playerToken = data.token;
    toggleElements();
  }).fail(function(jqxhr, textStatus, errorThrown){
    alert('Authorization failed. Please check login and password');
    //$('#result').val('login failed');
  });
  $('#email').val('');
  $('#password').val('');
};

// registers a new user with email/password combo
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
    //$('#result').val(JSON.stringify(data));
  }).fail(function(jqxhr, textStatus, errorThrown){
    alert('Registration failed. Please check login and password');
    //$('#result').val('registration failed');
  });
  $('#email').val('');
  $('#password').val('');
};

