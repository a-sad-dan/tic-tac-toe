// Factory function for player
const Player = (sign) => {
    const getSign = () => sign;
    return { getSign }
}


const p1 = Player('x');
const p2 = Player('o');


// Game Module Object
const GameModule = (() => {

    let scores = {
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
            const selectedSquare = document.querySelector(`[data-index = "${index}"]`);
            // setTimeout(() => {
            selectedSquare.classList.add('filled');
            // }, 150);
            selectedSquare.textContent = currentPlayer.getSign();
            gameBoard[index] = currentPlayer.getSign()
            switchPlayer();
            document.querySelector('.board').classList.toggle('cross-cursor');
            document.querySelector('.board').classList.toggle('circle-cursor');
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

    const resetGame = () => {
        gameBoard =
            ['', '', '',
                '', '', '',
                '', '', ''];
        document.querySelectorAll('.square').forEach(element => {
            element.textContent = '';
            if (element.classList.contains('filled')) { element.classList.remove(('filled')) }
            if (element.classList.contains('cross-cursor')) { element.classList.remove(('cross-cursor')) }
            if (element.classList.contains('circle-cursor')) { element.classList.remove(('circle-cursor')) }
            // element.classList.remove('filed');
        });
    }

    return { makeMove, isGameOver, getScores, getCurrentPlayer, resetGame, checkWin }
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
            setTimeout(() =>
                element.classList.remove('active'), 500
            )

            GameModule.makeMove(parseInt(element.getAttribute('data-index')));

            function writeToResult(text) {
                const resultModal = document.querySelector('.modal.result');
                resultModal.classList.remove('hidden');
                document.querySelector('.modal.result').textContent = text;
                resultModal.addEventListener('click', () => {
                    resultModal.classList.add('hidden');
                });
            }


            if (GameModule.checkWin(p1) || GameModule.checkWin(p2)) {
                const winner = (GameModule.getCurrentPlayer() == p1 ? p2 : p1)
                const winnerSign = winner.getSign();

                // To Log win of a player
                winner == p1 ? GameModule.getScores().p1 += 1 : GameModule.getScores().p2 += 1;

                writeToResult(`${winnerSign} wins this Round!`);
                setTimeout(() => {
                    GameModule.resetGame();
                }, 400);
                controlWindow.renderScore();
            }

            if (GameModule.isGameOver() && !(GameModule.checkWin(p1) || GameModule.checkWin(p2))) {
                writeToResult(`Round Tied`);

                // Log a tie
                GameModule.getScores().tie += 1;
                setTimeout(() => {
                    GameModule.resetGame();
                }, 400);
                controlWindow.renderScore();
            }
        }));
    }
};

playGame();