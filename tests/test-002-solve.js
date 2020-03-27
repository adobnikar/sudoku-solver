'use strict';

const { solve } = require('../index');
const { parse, validateFullGrid, isSubGrid } = require('../validate');

let test = `0 4 0 0 0 0 1 7 9
			0 0 2 0 0 8 0 5 4
			0 0 6 0 0 5 0 0 8
			0 8 0 0 7 0 9 1 0
			0 5 0 0 9 0 0 3 0
			0 1 9 0 6 0 0 4 0
			3 0 0 4 0 0 7 0 0
			5 7 0 1 0 0 2 0 0
			9 2 8 0 0 0 0 6 0`;

console.time('sudoku');
let sudoku = parse(test);
let sudokuSolved = solve(sudoku, true);
validateFullGrid(sudokuSolved);
if (!isSubGrid(sudoku, sudokuSolved)) throw new Error('The input sudoku is not a sub-grid of the solution.');
console.log(sudokuSolved);
console.timeEnd('sudoku');
console.log('');
