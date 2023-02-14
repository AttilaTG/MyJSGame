var internalTime = 0;
var timerId;
var gameTime;

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    var player1Image = document.getElementById("homer");
    var donuts = document.getElementById("donut");
    var obstacle = document.getElementById("obstacle");
    var timer = document.getElementById("timer");
    var resetGame = document.getElementById("resetGame");
    var audio = document.getElementById("audio");
    var audioButton = document.getElementById("audioButton");
    var numberOfPlayersURL = window.location.href;
    var url = new URL(numberOfPlayersURL);
    var numberOfPLayers = url.searchParams.get("players")
    console.log(numberOfPLayers)

    /*
    - Falta alternar entre un jugador o dos al crear las clases
    - Falta retocar css y estilos
    */

    var player = new Player();
    var board = new Board(player);

    board.showBoard(context, obstacle, donuts, player1Image, player);
    window.addEventListener("keydown", move);
    function move(e) {
        board.movePlayer(e, context, player1Image, player)
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
    constructor() { //posible mejora -> añadir nombre
        this.#collectedObjects = 0;
        var randomPlayerPosition = Math.floor((Math.random() * 4) + 1);
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
    set positionY(newPosY) {
        this.#positionY = newPosY;
    }

    collectedNewDonut() {
        this.collectedObjects++;
    }


}

class Board {
    #cells;
    #totalDonuts;
    constructor(jugador) {
        this.#totalDonuts = 0;

        var cellsArrayHeight = new Array();
        for (let i = 0; i < maxWidth; i++) {
            var cellsArrayWidth = new Array();
            for (let j = 0; j < maxHeight; j++) {

                var state = 0;
                var randomBoardCell = Math.floor((Math.random() * 20) + 1);

                if (jugador.positionX == i && jugador.positionY == j) {
                    state = 3
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


    showBoard(context, obstacle, donut, playerImage, playerObject) {
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
                    playerObject.positionX = cellPositionX;
                    playerObject.positionY = cellPositionY;
                    context.drawImage(playerImage, cellPositionX * amountOfPixels, cellPositionY * amountOfPixels);
                }
            }

        }
        startTimer();
    }

    movePlayer(e, context, playerImage, playerObject) {
        e = e || window.event;

        var playerPosX = playerObject.positionX;
        var playerPosY = playerObject.positionY;
        var currentCells = this.cells;
        context.clearRect(playerPosX * amountOfPixels, playerPosY * amountOfPixels, 100, 100);

        if (e.key == 'ArrowUp') {
            if (playerPosY - 1 >= 0) {
                if (!isObstacle(currentCells, playerPosX, playerPosY - 1)) {
                    playerPosY -= 1;
                    if (isDonut(currentCells, playerPosX, playerPosY)) {
                        currentCells[playerPosX][playerPosY].state = 0
                        playerObject.collectedNewDonut();
                        this.minusOneDount();
                    }
                    playerObject.positionY = playerPosY;
                }
            }

        } else if (e.key == 'ArrowDown') {
            if (playerPosY + 1 < maxHeight) {
                if (!isObstacle(currentCells, playerPosX, playerPosY + 1)) {
                    playerPosY += 1;
                    if (isDonut(currentCells, playerPosX, playerPosY)) {
                        currentCells[playerPosX][playerPosY].state = 0
                        playerObject.collectedNewDonut();
                        this.minusOneDount();
                    }
                    playerObject.positionY = playerPosY;
                }
            }

        } else if (e.key == 'ArrowLeft') {
            if (playerPosX - 1 >= 0) {
                if (!isObstacle(currentCells, playerPosX - 1, playerPosY)) {
                    playerPosX -= 1;
                    if (isDonut(currentCells, playerPosX, playerPosY)) {
                        currentCells[playerPosX][playerPosY].state = 0;
                        playerObject.collectedNewDonut();
                        this.minusOneDount();
                    }
                    playerObject.positionX = playerPosX;
                }
            }

        } else if (e.key == 'ArrowRight') {
            if (playerPosX + 1 < maxWidth) {
                if (!isObstacle(currentCells, playerPosX + 1, playerPosY)) {
                    playerPosX += 1;
                    if (isDonut(currentCells, playerPosX, playerPosY)) {
                        currentCells[playerPosX][playerPosY].state = 0;
                        playerObject.collectedNewDonut();
                        this.minusOneDount();
                    }
                    playerObject.positionX = playerPosX;
                }
            }

        }
        context.drawImage(playerImage, playerPosX * amountOfPixels, playerPosY * amountOfPixels);
    }

}

/*
Posbile types: 
Obstacle = 1
Donut = 2
Player = 3
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

function resetGameFunction(){
    location.reload();
}



