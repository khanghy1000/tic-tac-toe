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
		if (board[row][col].getValue() !== 0) return false;
		board[row][col].addToken(player.getToken());
		return true;
	};

	const checkBoard = () => {
		for (let i = 0; i < 3; i++) {
			if (
				board[i][0].getValue() === board[i][1].getValue() &&
				board[i][0].getValue() === board[i][2].getValue()
			) {
				return board[i][0].getValue();
			}

			if (
				board[0][i].getValue() === board[1][i].getValue() &&
				board[0][i].getValue() === board[2][i].getValue()
			) {
				return board[i][0].getValue();
			}
		}
		if (
			board[0][0].getValue() === board[1][1].getValue() &&
			board[0][0].getValue() === board[2][2].getValue()
		) {
			return board[0][0].getValue();
		}

		if (
			board[0][2].getValue() === board[1][1].getValue() &&
			board[0][2].getValue() === board[2][0].getValue()
		) {
			return board[0][2].getValue();
		}
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

const GameController = () => {
	let gameBoard = GameBoard();
	let player1 = Player('player1', 1);
	let player2 = Player('player2', 2);

	let activePlayer = player1;

	const playRound = (row, col) => {
		console.log(`${activePlayer.getName()} marks row ${row} row ${col}`);
		const markSuccess = gameBoard.markCell(row, col, activePlayer);
		if (markSuccess)
			activePlayer = activePlayer === player1 ? player2 : player1;

		gameBoard.printBoard();

		if (gameBoard.checkBoard() === player1.getToken()) {
			console.log(`${player1.getName()} win`);
		} else if (gameBoard.checkBoard() === player2.getToken()) {
			console.log(`${player2.getName()} win`);
		}
	};
	gameBoard.printBoard();

	return { playRound };
};

let gameController = GameController();
