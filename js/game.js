var internalTime = 0;
var timerId;
var gameTime;

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var player1Image = document.getElementById("homer");
    var player2Image = document.getElementById("homer2");
    var player1Donuts = document.getElementById("player1Donuts");
    var player2Donuts = document.getElementById("player2Donuts");
    var donuts = document.getElementById("donut");
    var obstacle = document.getElementById("obstacle");
    var timer = document.getElementById("timer");
    var resetGame = document.getElementById("resetGame");
    var audio = document.getElementById("audio");
    var audioButton = document.getElementById("audioButton");
    var numberOfPlayersURL = window.location.href;
    var url = new URL(numberOfPlayersURL);
    var numberOfPLayers = url.searchParams.get("players");

    /*
    - Falta alternar entre un jugador o dos al crear las clases
    - Falta retocar css y estilos
    */

    var player1 = new Player(player1Image);
    if (numberOfPLayers == "2"){
        var player2 = new Player(player2Image);
        var board = new Board(player1, player2);
        board.showBoard(context, obstacle, donuts, player1, player2);
    } else if(numberOfPLayers == "1") {
        var board = new Board(player1);
        board.showBoard(context, obstacle, donuts, player1);
    } else {
        alert("No intentes manipular la URL!")
        window.location.replace('../index.html');        
    }
    

    //board.showBoard(context, obstacle, donuts, player);
    window.addEventListener("keydown", move);
    function move(e) {
        //new
        e = e || window.event;

         if((e.key == 'ArrowUp')||(e.key == 'ArrowDown')||(e.key == 'ArrowLeft')||(e.key == 'ArrowRight')){
            board.movePlayer(e, context, player1);
         } 
        if((player2 != undefined)&&((e.key == 'w')||(e.key == 'a')||(e.key == 's')||(e.key == 'd'))) {
            board.movePlayer(e, context, player2)
            
         }
         player1Donuts.innerHTML = "Donuts: " + player1.collectedObjects;
        if (player2 != undefined) {
        player2Donuts.innerHTML = "Donuts: " + player2.collectedObjects;
    }
        //old
        //board.movePlayer(e, context, player)
        board.playerWins();
    }

    

    resetGame.addEventListener("click", resetGameFunction);

    audioButton.addEventListener("click", pauseOrResumeAudio);

}



/*
Clases:
- Jugador
- Tablero
- Donut
- Obstaculo
*/

const amountOfPixels = 100;
const maxWidth = 12;
const maxHeight = 7;

class Player {
    #collectedObjects;
    #positionX;
    #positionY;
    #playerImage;
    constructor(playerImage) {
        this.#playerImage = playerImage;
        this.#collectedObjects = 0;
        /*
        var randomPlayerPosition = Math.floor((Math.random() * 4) + 1); //esto da errores
        switch (randomPlayerPosition) {
            case 1:
                this.#positionX = 0;
                this.#positionY = 0;
                break;
            case 2:
                this.#positionX = 0;
                this.#positionY = maxHeight - 1;
                break;
            case 3:
                this.#positionX = maxWidth - 1;
                this.#positionY = 0;
                break;

            case 4:
                this.#positionX = maxWidth - 1;
                this.#positionY = maxHeight - 1;
                break;
        }
        */
    }

    get collectedObjects() {
        return this.#collectedObjects;
    }
    set collectedObjects(newObject) {
        this.#collectedObjects = newObject
    }
    get positionX() {
        return this.#positionX;
    }
    set positionX(newPositionX) {
        this.#positionX = newPositionX;
    }
    get positionY() {
        return this.#positionY;
    }
    set positionY(newPositionY) {
        this.#positionY = newPositionY;
    }

    get playerImage() {
        return this.#playerImage;
    }

    collectedNewDonut() {
        this.collectedObjects++;
    }
}

class Board {
    #cells;
    #totalDonuts;
    constructor(jugador, ...args) {
        var jugador2;
        if (args.length == 1){
            jugador2 = args[0];
        }
        this.#totalDonuts = 0;

        var cellsArrayHeight = new Array();
        for (let i = 0; i < maxWidth; i++) {
            var cellsArrayWidth = new Array();
            for (let j = 0; j < maxHeight; j++) {
                var state = 0;
                var randomBoardCell = Math.floor((Math.random() * 20) + 1);
                
                if (i == 0 && j == 0) {
                    jugador.positionX = 0
                    jugador.positionY = 0
                    state = 3
                } else if ((jugador2 != undefined) && (maxWidth - 1 == i && maxHeight - 1 == j)) {
                    jugador2.positionX = maxWidth -1;
                    jugador2.positionY = maxHeight-1;
                    state = 4
                } else if (randomBoardCell >= 15) {
                    var randomCellState = Math.floor((Math.random() * 10) + 1);
                    if (randomCellState % 2 == 0) {
                        state = 1;
                    }
                    else {
                        state = 2;
                        this.#totalDonuts++;
                    }
                } else {
                    state = 0;
                }

                var cell = new Cell(state);
                cellsArrayWidth.push(cell);
            }

            cellsArrayHeight.push(cellsArrayWidth);
        }
        this.#cells = cellsArrayHeight;
    }

    get cells() {
        return this.#cells
    }

    set cells(newCellArray) {
        this.#cells = newCellArray;
    }

    get totalDonuts() {
        return this.#totalDonuts;
    }

    set totalDonuts(newDounts) {
        this.#totalDonuts = newDounts;
    }


    minusOneDount() {
        this.totalDonuts--;
    }

    playerWins() {
        if (this.totalDonuts == 0) {
            alert("Has  ganado!")
            stopTimer();
        }
    }

    showBoard(context, obstacle, donut, player1, ...args) {
        var player2; // aqui falla algo
        if (args.length == 1){
            player2 = args[0];
        }
        for (let cellRow = 0; cellRow < this.cells.length; cellRow++) {
            for (let cellColumn = 0; cellColumn < this.cells[cellRow].length; cellColumn++) {

                var cellType = this.#cells[cellRow][cellColumn].state;
                var cellPositionX = cellRow;
                var cellPositionY = cellColumn;

                if (cellType == 1) {
                    context.drawImage(obstacle, cellPositionX * amountOfPixels, cellPositionY * amountOfPixels)
                } else if (cellType == 2) {
                    context.drawImage(donut, cellPositionX * amountOfPixels, cellPositionY * amountOfPixels)
                } else if (cellType == 3) {
                    
                    context.drawImage(player1.playerImage, cellPositionX * amountOfPixels, cellPositionY * amountOfPixels);
                }
                else if (cellType == 4) {
                    context.drawImage(player2.playerImage, cellPositionX * amountOfPixels, cellPositionY * amountOfPixels); //aqui en concreto ????
                }
            }

        }
        startTimer();
    }

    movePlayer(e, context, playerObject) {
        e = e || window.event;

        var playerPosX = playerObject.positionX;
        var playerPosY = playerObject.positionY;
        var newPosition;
        context.clearRect(playerPosX * amountOfPixels, playerPosY * amountOfPixels, 100, 100);
        
        if ((e.key == 'ArrowUp' || (e.key == 'w')) && (playerPosY - 1 >= 0)) {
            newPosition = playerPosY - 1;
            movePlayerWhenIsNotObstacle(playerObject, playerPosX, newPosition, this);
        } else if ((e.key == 'ArrowDown' || (e.key == 's')) && (playerPosY + 1 < maxHeight)) {
            newPosition = playerPosY + 1
            movePlayerWhenIsNotObstacle(playerObject, playerPosX, newPosition, this);
        } else if ((e.key == 'ArrowLeft' ||(e.key == 'a')) && (playerPosX - 1 >= 0)) {
            newPosition = playerPosX - 1
            movePlayerWhenIsNotObstacle(playerObject, newPosition, playerPosY, this);
        } else if ((e.key == 'ArrowRight'||(e.key == 'd')) && (playerPosX + 1 < maxWidth)) {
            newPosition = playerPosX + 1
            movePlayerWhenIsNotObstacle(playerObject, newPosition, playerPosY, this);
        }
        context.drawImage(playerObject.playerImage, playerObject.positionX * amountOfPixels, playerObject.positionY * amountOfPixels);
    }
}

/*
Posbile types: 
Obstacle = 1
Donut = 2
Player = 3
Player 2 = 4
*/
class Cell {
    #state

    constructor(inputType) {
        this.#state = inputType
    }

    get state() {
        return this.#state;
    }

    set state(newType) {
        this.#state = newType
    }
}


//functions

function movePlayerWhenIsNotObstacle(playerObject, positionX, positionY, boardObject) {
    var currentCells = boardObject.cells;
    if (!isObstacle(currentCells, positionX, positionY)) {
        if (isDonut(currentCells, positionX, positionY)) {
            currentCells[positionX][positionY].state = 0;
            playerObject.collectedNewDonut();
            console.log(playerObject.collectedObjects)
            boardObject.minusOneDount();
        }
        playerObject.positionX = positionX;
        playerObject.positionY = positionY;
    }
}

function isObstacle(currentCells, playerPosX, playerPosY) {
    if (currentCells[playerPosX][playerPosY].state == 1) {
        return true;
    }
    return false;
}

function isDonut(currentCells, playerPosX, playerPosY) {
    if (currentCells[playerPosX][playerPosY].state == 2) {
        return true;
    }
    return false;
}

function startTimer() {
    timerId = setInterval(() => {
        internalTime++;
        let minutes = Math.floor(internalTime / 60);
        let seconds = internalTime % 60;
        gameTime = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        document.getElementById('timer').innerHTML = gameTime
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

function pauseOrResumeAudio() {
    if (audio.paused) {
        audio.play();
        audioButton.textContent = "Pausar";
    } else {
        audio.pause();
        audioButton.textContent = "Reproducir";
    }
}

function resetGameFunction() {
    location.reload();
}



