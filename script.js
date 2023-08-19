// Factory function for player
const Player = (sign) => {
    const getSign = () => sign;
    return { getSign }
}

let vsAiMode = 1;
let AiLevel = 1; //  0 - easy, 1 - hard, 2 - impossible

const changeAiLevel = (level) => {
    if (level !== AiLevel) { AiLevel = level };
}

const toggleAi = () => vsAiMode == 1 ? 0 : 1;

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


            document.querySelector('.board').classList.toggle('cross-cursor');
            document.querySelector('.board').classList.toggle('circle-cursor');

            printGameBoard();

            switchPlayer();
            checkWinnerAndTie();


            if (!isGameOver() && !(checkWin(p1) || checkWin(p2))) {
                if (vsAiMode && currentPlayer === p2) {
                    setTimeout(() => {
                        computerPlayRound();
                    }, 150);
                    console.log('puter made this move');
                }
            }
        }
    }


    const printGameBoard = () => {
        console.log(`${gameBoard[0]} ${gameBoard[1]} ${gameBoard[2]}`)
        console.log(`${gameBoard[3]} ${gameBoard[4]} ${gameBoard[5]}`)
        console.log(`${gameBoard[6]} ${gameBoard[7]} ${gameBoard[8]}`)
    }
    const computerPlayRound = () => {

        // Finding the valid moves left
        const validMoveIndexes = gameBoard.reduce((acc, value, index) => {
            if (value === "") {
                acc.push(index);
            }
            return acc;
        }, [])

        //Level 0 - easy (random moves)
        const randomIndex = validMoveIndexes[Math.floor(Math.random() * validMoveIndexes.length)]
        if (AiLevel == 0) {
            makeMove(randomIndex);
        }

        const findWinningMove = (player) => {
            for (let i = 0; i < validMoveIndexes.length; i++) {
                let index = validMoveIndexes[i];
                gameBoard[index] = player.getSign();
                if (checkWin(player)) {
                    gameBoard[index] = ""; //reset the simulated position
                    return index;
                };
                gameBoard[index] = ""; //reset the simulated position
            }
            return -1;
        }

        // Level 1 - makes winning move, blocks player move
        if (AiLevel == 1) {
            const winningMove = findWinningMove(p2);
            const blockingMove = findWinningMove(p1);

            // console.log('winning move : ', winningMove);

            if (winningMove != -1) {
                makeMove(winningMove);
                console.log('tring to make winning move')
            } else if (blockingMove !== -1) {
                makeMove(blockingMove);
                console.log('tring to make blocking move')
            } else {
                makeMove(randomIndex);
                console.log('tring to make random move')
            }
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

    const checkWinnerAndTie = () => {
        if (checkWin(p1) || checkWin(p2)) {
            const winner = getCurrentPlayer() == p1 ? p2 : p1;
            const winnerSign = winner.getSign();

            // To Log win of a player
            winner == p1 ? getScores().p1 += 1 : getScores().p2 += 1;

            setTimeout(() => {
                writeToResult(`${winnerSign} wins this Round!`);
            }, 300);
            controlWindow.renderScore();
        }

        if (isGameOver() && !(checkWin(p1) || checkWin(p2))) {
            writeToResult(`Round Tied`);

            // Log a tie
            GameModule.getScores().tie += 1;
            controlWindow.renderScore();
        }
    }

    function writeToResult(text) {
        const resultModal = document.querySelector('.modal .result');
        const modal = document.querySelector('.modal');
        modal.classList.remove('hidden');

        resultModal.textContent = text;

        modal.addEventListener('click', () => {
            modal.classList.add('hidden');
            resetGame();

        });
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

        if (currentPlayer == p2) {
            document.querySelector('.board').classList.toggle('cross-cursor');
            document.querySelector('.board').classList.toggle('circle-cursor');
        }

        currentPlayer = p1;
    }

    return { makeMove, getScores, getCurrentPlayer }
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


//  Main Game loop
const playGame = () => {
    {
        let currentPlayer = GameModule.getCurrentPlayer();

        const positionsArr = document.querySelectorAll('.square');
        // console.log(`current player : ${currentPlayer.getSign()}`)
        //Getting input from users

        // Toggle Effect on Click
        positionsArr.forEach(element => element.addEventListener('mousedown', () => {
            element.classList.add('active');
        }));
        positionsArr.forEach(element => element.addEventListener('mouseup', () => {
            GameModule.makeMove(parseInt(element.getAttribute('data-index')));
            element.classList.remove('active');
        }));
    };
};
playGame();