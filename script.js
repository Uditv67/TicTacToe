const Gameboard = (function () {
    const board = ["", "", "", "", "", "", "", "", "",];

    const getBoard = () => board;

    const placeMark = (index, marker) => {
      if(board[index] === ""){
        board[index] = marker;
        return true;
      } 
      else{
        return false;
      } 
    }

    const reset = () => {
      for (let i = 0; i < board.length; i++) {   
        board[i] = "";
      }
    }

    return { getBoard, placeMark, reset };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const startGame = (name1, name2) => {
    players = [Player(name1, "X"), Player(name2, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.reset();
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const playRound = (index) => {
    const currentPlayer = getCurrentPlayer();  

    if (gameOver) return;  

    const success = Gameboard.placeMark(index, currentPlayer.marker);
    if (!success) return;   

    if (checkWin()) {
      gameOver = true;
      return `${currentPlayer.name} wins!`;
    }

    if (checkTie()) {
      gameOver = true;
      return "It's a tie!";
      
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;   

  };

  const checkWin = () => {
    const board = Gameboard.getBoard();

    const winningCombos = [
      [0,1,2], [3,4,5], [6,7,8], // rows
      [0,3,6], [1,4,7], [2,5,8], // columns
      [0,4,8], [2,4,6]           // diagonals
    ];
    for(let combo of winningCombos){
      const[a,b,c] = combo;
      if(board[a] === board[b] && board[b] === board[c] && board[a] !== ""){
        return true;
      }
    }
    return false;
  };

  const checkTie = () => {
    const board = Gameboard.getBoard();
    const isFull = board.every(cell => cell !== "");  
    return isFull && !checkWin(); 
  };

  return { startGame, getCurrentPlayer, playRound };
})();


const DisplayController = (function () {
  const boardContainer = document.querySelector("#board");
  const resultDisplay = document.querySelector("#result");
  const startBtn = document.querySelector("#start-btn");

  const renderBoard = () => {
    boardContainer.innerHTML = "";
    const board = Gameboard.getBoard();
    for(let i = 0; i < board.length; i++){
      const cell = document.createElement("div");
      cell.textContent = board[i];
      cell.dataset.index = i; 
      cell.classList.add("cell");
      boardContainer.appendChild(cell);
    }
    

  };

  const handleCellClick = (event) => {
    const index = Number(event.target.dataset.index);
    const result = GameController.playRound(index);
    renderBoard();
    
    if (result) {
      resultDisplay.textContent = result;
    }
  };

  const handleStartClick = () => {
    const name1 = document.querySelector("#player1-name").value;
    const name2 = document.querySelector("#player2-name").value;
    GameController.startGame(name1, name2);
    resultDisplay.textContent = "";
    renderBoard();
  };

  boardContainer.addEventListener("click", handleCellClick);
  startBtn.addEventListener("click", handleStartClick);

  return { renderBoard };
})();

GameController.startGame("Alice", "Bob");
DisplayController.renderBoard();