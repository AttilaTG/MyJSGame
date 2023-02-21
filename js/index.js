var player = document.getElementById("playerNum");
var playerMode = document.getElementById("playerModeText");
var numberOfPLayers = 1;
player.addEventListener("click", changePlayers);
function changePlayers() {
  if (player.textContent == "Cambiar a Multijugador") {
      numberOfPLayers = 2;
      playerMode.innerHTML = "Modo Multijugador";
      player.textContent = "Cambiar a un jugador";
  } else {
      numberOfPLayers = 1;
      playerMode.innerHTML = "Modo Un Jugador";
      player.textContent = "Cambiar a Multijugador";
  }
}

const btnInicio = document.getElementById('startGame');
btnInicio.addEventListener('click', function() {
  window.location.replace('./html/game.html?players='+numberOfPLayers);
});