'use strict';

const { EOL } = require('os');

let PRINT_GRID = `x x x  x x x  x x x${EOL}x x x  x x x  x x x${EOL}x x x  x x x  x x x${EOL}${EOL}`;
PRINT_GRID += `x x x  x x x  x x x${EOL}x x x  x x x  x x x${EOL}x x x  x x x  x x x${EOL}${EOL}`;
PRINT_GRID += `x x x  x x x  x x x${EOL}x x x  x x x  x x x${EOL}x x x  x x x  x x x`;

function print(sudoku) {
	let text = PRINT_GRID.split('');
	let inx = 0;
	for (let i = 0; i < text.length; i++) {
		if (text[i] !== 'x') continue;
		if (sudoku[inx] == null) text[i] = '_';
		else text[i] = String(sudoku[inx]);
		inx++;
	}
	text = text.join('');
	console.log(text);
}

module.exports = {
	print,
};
