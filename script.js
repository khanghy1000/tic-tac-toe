const GameBoard = () => {
	let board = [];
	for (let i = 0; i < 3; i++) {
		board[i] = [];
		for (let j = 0; j < 3; j++) {
			board[i].push(Cell());
		}
	}

	const getBoard = () => board;

	const printBoard = () => {
		const mappedBoard = board.map(row => row.map(cell => cell.getValue()));
		console.table(mappedBoard);
	};

	const markCell = (row, col, player) => {
		board[row][col].addToken(player.getToken());
	};

	const checkBoard = () => {
		for (let i = 0; i < 3; i++) {
			if (
				board[i][0].getValue() === board[i][1].getValue() &&
				board[i][0].getValue() === board[i][2].getValue() &&
				board[i][0].getValue() !== 0
			) {
				return board[i][0].getValue();
			}

			if (
				board[0][i].getValue() === board[1][i].getValue() &&
				board[0][i].getValue() === board[2][i].getValue() &&
				board[0][i].getValue() !== 0
			) {
				return board[0][i].getValue();
			}
		}
		if (
			board[0][0].getValue() === board[1][1].getValue() &&
			board[0][0].getValue() === board[2][2].getValue() &&
			board[0][0].getValue() !== 0
		) {
			return board[0][0].getValue();
		}

		if (
			board[0][2].getValue() === board[1][1].getValue() &&
			board[0][2].getValue() === board[2][0].getValue() &&
			board[0][2].getValue() !== 0
		) {
			return board[0][2].getValue();
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j].getValue() === 0) {
					return -1;
				}
			}
		}
		return 0;
	};

	return { getBoard, printBoard, markCell, checkBoard };
};

const Player = (name, token) => {
	const getName = () => {
		return name;
	};
	const getToken = () => {
		return token;
	};
	return { getName, getToken };
};

const Cell = () => {
	let value = 0;
	const addToken = playerToken => {
		value = playerToken;
	};
	const getValue = () => {
		return value;
	};
	return { getValue, addToken };
};

const GameController = (firstPlayerName, secondPlayerName) => {
	let gameBoard = GameBoard();
	let player1 = Player(firstPlayerName, 1);
	let player2 = Player(secondPlayerName, 2);
	let message = '';
	let checkBoard;

	let activePlayer = player1;

	const playRound = (row, col) => {
		console.log(`${activePlayer.getName()} marks row ${row} col ${col}`);
		gameBoard.markCell(row, col, activePlayer);
		activePlayer = activePlayer === player1 ? player2 : player1;

		if (checkBoard === 1 || checkBoard === 2) return;
		checkBoard = gameBoard.checkBoard();
		console.log(checkBoard);

		switch (checkBoard) {
			case -1:
				message = `${activePlayer.getName()} turn`;
				break;
			case 0:
				message = 'Tie';
				break;
			case 1:
				message = `${player1.getName()} win`;
				break;
			case 2:
				message = `${player2.getName()} win`;
				break;
			default:
				message = 'Something wrong';
				return;
		}
	};

	const getMessage = () => message;

	const getCheckBoard = () => checkBoard;

	return {
		playRound,
		getBoard: gameBoard.getBoard,
		getMessage,
		getCheckBoard,
	};
};

const ScreenController = () => {
	let gameController = GameController('Player 1', 'Player 2');
	const messageDiv = document.querySelector('.message');
	const gameBoardDiv = document.querySelector('.game-board');
	const restartBtn = document.querySelector('.restart-btn');

	const updateScreen = () => {
		const message = gameController.getMessage();
		messageDiv.textContent = message;
		gameBoardDiv.textContent = '';
		const board = gameController.getBoard();
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const cellDiv = document.createElement('div');
				cellDiv.classList.add('cell');
				cellDiv.dataset.row = i;
				cellDiv.dataset.col = j;

				if (board[i][j].getValue() !== 0) {
					cellDiv.dataset.token = board[i][j].getValue();
				}

				gameBoardDiv.append(cellDiv);
			}
		}
	};

	const clickHandlerBoard = e => {
		if (
			gameController.getCheckBoard() === 1 ||
			gameController.getCheckBoard() === 2
		) return;
			if (e.target.dataset.token) return;
		const selectedRow = e.target.dataset.row;
		const selectedColumn = e.target.dataset.col;
		if (!selectedColumn) return;
		gameController.playRound(selectedRow, selectedColumn);
		updateScreen();
	};

	gameBoardDiv.addEventListener('click', clickHandlerBoard);

	restartBtn.addEventListener('click', () => {
		gameController = GameController('Player 1', 'Player 2');
		updateScreen()
	})

	updateScreen();
};

ScreenController();
