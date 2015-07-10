
$(document).ready(function() {

  // renders 0-0 score after first load
  scoreRender();

  // updates currentBoard array and rerenders the board upon a new move
  $('.boardcells').on('click', clickHandler);

  // loads a list of games to a collapsable area below the button
  $('#collapseExample').on('show.bs.collapse', getList);

  // reloads the page and resets the token upon click
  $('logout').on('click', function(e) {
     location.reload();
     playerToken = '';
     toggleElements();
  });

  $('#join').on('click', joinGame);

  $('#register').on('click', registerPlayer);

  $('#signin').on('click', signIn);

  $('#start').on('click', startGame);

  $('#show').on('click', showGame);
});
