const userInterfaceDialogue = (() =>{
    const renderMessage = (message) =>{
        document.querySelector("#message").innerHTML = message;
    } 
    const renderNames = (message) =>{
        document.querySelector("#players").innerHTML = message;
    }
    return {
        renderMessage,
        renderNames
    }
})();


const gameBoard = (()=>{
    // creates an array with 9 position
    let board = Array(9).fill("");

    // renders the gameboard
    const render = () => {
        let boardHTML = "";
        board.forEach((square, index)=>{
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares =  document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", gameMechanics.handleClick);
        })
        
    }
    const updateGameboard = (index, value) => {
        board[index] = value;
        render();
    }

    const gameBoardAccess = () => board;

    return {
        render,
        updateGameboard,
        gameBoardAccess

    }
})();

const createPlayers = (name, symbol) => {
    return {
        name, symbol
    }
}

const gameMechanics = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver = false;

    const startGame = () => {
        players = [
            createPlayers(document.querySelector("#player-one-name").value, "X"),
            createPlayers(document.querySelector("#player-two-name").value, "O")
        ]

        const playerOneInput = document.querySelector("#player-one-name").value.trim();
        const playerTwoInput = document.querySelector("#player-two-name").value.trim();

        if(playerOneInput === "" || playerTwoInput === ""){
            userInterfaceDialogue.renderMessage("Please enter names for both players!");
            return;
        }
        currentPlayerIndex = 0;
        gameOver = false;
        userInterfaceDialogue.renderNames(`${players[0].name} vs ${players[1].name}`)
        gameBoard.render();
        
    }

    const handleClick = (event) => {
        if(gameOver){
            return;
        }
        let clickIndex = parseInt(event.target.id.split("-")[1]);
        if(gameBoard.gameBoardAccess()[clickIndex] !=="")
            return;
        gameBoard.updateGameboard(clickIndex, players[currentPlayerIndex].symbol);
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

        if(checkForWin(gameBoard.gameBoardAccess(), players[currentPlayerIndex].symbol)){
            gameOver = true;
            userInterfaceDialogue.renderMessage(`${players[currentPlayerIndex].name} won!`)
        } else if(checkForTie(gameBoard.gameBoardAccess())){
            gameOver = true;
            userInterfaceDialogue.renderMessage("It's a tie!");

        }
        
    }

    const restartGame = () =>{
       for(let i = 0; i < 9; i++){
        gameBoard.updateGameboard(i, "");
       }
       gameBoard.render();
       gameOver = false;
       document.querySelector("#message").textContent = "";

    }
    
    return {
        startGame,
        handleClick,
        restartGame, 
    
    }
        
})();

function checkForWin(board){
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for(let i = 0; i < winningCombos.length; i++){
        const [a, b, c] = winningCombos[i];
        if(board[a] && board[a] === board[b] && board[a]===board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie(board){
    return board.every(cell => cell !== "")
}

const startButton = document.querySelector("#start-game");
startButton.addEventListener('click', function(){
    gameMechanics.startGame();
})

const restartButton = document.querySelector("#reset-game");
restartButton.addEventListener("click", () =>{
    gameMechanics.restartGame();
})