// Factory function for player
const Player = (sign) => {
    const getSign = () => sign;
    return { getSign }
}


const p1 = Player('x');
const p2 = Player('o');


// Game Module Object
const GameModule = (() => {

    const scores = {
        "p1": 0,
        "tie": 0,
        "p2": 0
    }

    const getScores = () => {
        return scores;
    }


    let gameBoard =
        ['', '', '',
            '', '', '',
            '', '', ''];




    // Public method to make a move
    const makeMove = (index) => {
        if (gameBoard[index] == '') {
            document.querySelector(`[data-index = "${index}"]`).textContent = currentPlayer.getSign();
            gameBoard[index] = currentPlayer.getSign()
            switchPlayer();
            printBoard();
        }

        else {
            console.log('position already taken');
        }
    }

    const switchPlayer = () => {
        currentPlayer == p1 ? currentPlayer = p2 : currentPlayer = p1;
    }

    let currentPlayer = p1;

    const getCurrentPlayer = () => currentPlayer;


    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Private Function to check if a player has won
    const checkWin = (player) => {
        return winningCombinations.some(combination => { return combination.every(index => gameBoard[index] === player.getSign()) })
    }


    // Private Method to check if the game is over
    const isGameOver = () => {
        return (gameBoard.every(entry => entry !== ''));
    }





    // Public method to print the board after every move
    const printBoard = () => {
        console.log(`${gameBoard[0]}    ${gameBoard[1]}     ${gameBoard[2]}`)
        console.log(`${gameBoard[3]}    ${gameBoard[4]}     ${gameBoard[5]}`)
        console.log(`${gameBoard[6]}    ${gameBoard[7]}     ${gameBoard[8]}`)
    }

    const resetGame = () => {
        gameBoard =
            ['', '', '',
                '', '', '',
                '', '', ''];
        document.querySelectorAll('.square').forEach(element => element.textContent = '');
    }

    return { makeMove, isGameOver, getScores, getCurrentPlayer, resetGame, printBoard, checkWin }
})();




// IIFe Control window logic
const controlWindow = (() => {
    const renderScore = () => {
        const scores = GameModule.getScores();
        for (const name in scores) {
            const element = document.querySelector(`.${name}.score`);
            if (element) {
                element.textContent = `${scores[name]}`;
            }
        }
    }
    return { renderScore }
})();

controlWindow.renderScore()

//  Main Game loop
const playGame = () => {
    {
        const currentPlayer = GameModule.getCurrentPlayer();
        console.log(`Current Player : ${currentPlayer.getSign()}`);

        //Getting input from users
        const positionsArr = document.querySelectorAll('.square');
        positionsArr.forEach(element => element.addEventListener('click', () => {
            element.classList.add('active');
            setTimeout(()=>
            element.classList.remove('active'),150
            )

            GameModule.makeMove(parseInt(element.getAttribute('data-index')));

            if (GameModule.checkWin(p1) || GameModule.checkWin(p2)) {
                const winner = (GameModule.getCurrentPlayer().getSign() === 'x' ? p2.getSign() : p1.getSign())
                setTimeout(()=>
                alert(`Winner is ${winner}`)
                ,200)

                setTimeout(() => {
                    GameModule.resetGame();
                }, 400);
            }

            if (GameModule.isGameOver() && !(GameModule.checkWin(p1) || GameModule.checkWin(p2))) {
                setTimeout(()=>
                alert('Game Tied')
                ,200)
                setTimeout(() => {
                    GameModule.resetGame();
                }, 400);
            }

        }));


        // const position = prompt("Enter position from 1 - 9");
        // const index = parseInt(position) -1 ;
        // console.log(index);
        // GameModule.makeMove(index);

    }
};

playGame();