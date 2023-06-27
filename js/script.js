const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const render = () => {
        let boardHTML = "";

        board.forEach((cell, index) => {
            boardHTML += `<div class="cell" id=cell-${index}>${cell}</div>`;
        });
        document.querySelector('.board-container').innerHTML = boardHTML;
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', Game.handleClick);
        });

    };

    const update = (index, value) => {
        board[index] = value;
        render();
    };
    const getBoard = () => board;
    return {
        render,
        update,
        getBoard
    }
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark: `<i class="${mark}"></i>`
    }
}
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const modal = document.querySelector('.modal'),
    overlay = document.querySelector('.overlay'),
    modalText = document.querySelector('.modal h5');
    const updateStatus = () => {
        const statusTitle = document.querySelector('.status-text span');
        statusTitle.textContent = players[currentPlayerIndex].name;
    };
    const start = () => {
        players = [
            createPlayer('Fire', 'fa-solid fa-fire'),
            createPlayer('Water', 'fa-solid fa-droplet')
        ];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        updateStatus();
    };

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }
        let index = parseInt(event.target.id.split('-')[1]);
        if (Gameboard.getBoard()[index] !== "") {
            return;
        }
        Gameboard.update(index, players[currentPlayerIndex].mark);
   

        if (checkForWin(Gameboard.getBoard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            modal.style.transform = 'translateY(0)';
            overlay.style.display = 'block';
            modalText.textContent = `${players[currentPlayerIndex].name} Wins!`;
            // alert(`${players[currentPlayerIndex].name} won!`);
        } else if (checkForDraw(Gameboard.getBoard())) {
            gameOver = true;
            modal.style.transform = 'translateY(0)';
            overlay.style.display = 'block';
            modalText.textContent = `It's a Draw!`;
            // alert(`It's a draw!`);
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        updateStatus();
    };

    const restart = () => {

        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        modal.style.transform = 'translateY(-250%)';
        overlay.style.display = 'none';
        Gameboard.render();
        gameOver = false;
    }
    return {
        start,
        restart,
        updateStatus,
        handleClick
    }
})();

function checkForWin(board) {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForDraw(board) {
    return board.every(cell => cell !== "");
}

Game.start();
const restartBtns = document.querySelectorAll('.restart-btn');
restartBtns.forEach(btn => {
    btn.addEventListener('click', Game.restart);
});