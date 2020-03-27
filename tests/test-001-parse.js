'use strict';

const { parse, validateGrid } = require('../validate');

let test = `0 4 0 0 0 0 1 7 9
			0 0 2 0 0 8 0 5 4
			0 0 6 0 0 5 0 0 8
			0 8 0 0 7 0 9 1 0
			0 5 0 0 9 0 0 3 0
			0 1 9 0 6 0 0 4 0
			3 0 0 4 0 0 7 0 0
			5 7 0 1 0 0 2 0 0
			9 2 8 0 0 0 0 6 0`;

let sudoku = parse(test);
validateGrid(sudoku);
console.log(sudoku);
