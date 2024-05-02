const submitBtn = document.querySelector(".submit");
const restartBtn = document.querySelector(".restart");
const messageDiv = document.querySelector(".message");
const nickInput1 = document.querySelector("#nickname1");
const nickInput2 = document.querySelector("#nickname2");

const displayController = (() => {
  const renderMessage = (message) => {
    messageDiv.textContent = message;
  }

  return {
    renderMessage,
  }
})();

const Gameboard = (() => {
  let gameBoard = ["", "", "", "", "", "", "", "", ""]

  const render = () => {
    const gameBoardElement = document.getElementById('game-board');
    gameBoardElement.innerHTML = "";
    gameBoard.forEach((square, index) => {
      const squareElement = document.createElement('div');
      squareElement.classList.add("square", "cell");
      squareElement.textContent = square;
      const squareId = `${index}`;
      squareElement.id = squareId;
      squareElement.addEventListener("click", Game.handleClick);
      gameBoardElement.appendChild(squareElement);
    });
  };

  const update = (index, value) => {
    gameBoard[index] = value;
    render();
  }

  const getGameboard = () => {
    return gameBoard;
  }

  return {
    render,
    update,
    getGameboard
  }
})();


function createPlayer(name, mark) {
  return { name, mark };
}

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const handleClick = (e) => {
    if (gameOver) { return };
    const squareID = parseInt(e.target.id);

    const nextPlayer = players[currentPlayerIndex === 0 ? 1 : 0];
    if (Gameboard.getGameboard()[squareID] !== "")
      return;
    Gameboard.update(squareID, players[currentPlayerIndex].mark)
    if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
      gameOver = true;
      displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
      
    } else if (checkForTie(Gameboard.getGameboard())) {
      gameOver = true;
      displayController.renderMessage(`It's a tie!`)
    } else {
      displayController.renderMessage(`Current turn: ${nextPlayer.name}`);
  }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    restartBtn.disabled = false;
  } 

  const start = () => {
     if(nickInput1.value === "" || nickInput2.value === "") {
      messageDiv.textContent = "Pro začátek hry je nutné vyplnit jména hráčů!"
      return;
     }

    players = [
      createPlayer(nickInput1.value, "X"),
      createPlayer(nickInput2.value, "O"),
    ]
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.render();
    firstRoundMessage();
  }

  const restart = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, "")
    }
    Gameboard.render();
    messageDiv.textContent = "";
    gameOver = false;
    currentPlayerIndex = 0;
    firstRoundMessage();
    restartBtn.disabled = true;
  }

  const firstRoundMessage = () => {
    displayController.renderMessage(`Current turn: ${players[0].name}`);
  }

  return {
    handleClick,
    start,
    restart,
  }
})();


function checkForWin(board) {
  const winningCombinations = [
    // Horizontální řádky
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertikální sloupce
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonály
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every(cell => cell !== "");
}


restartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  Game.restart();
})

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  Game.start();
})

