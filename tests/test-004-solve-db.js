'use strict';

const fs = require('fs');
const path = require('path');
const walk = require('../helpers/fs-walk');
const { solve } = require('../index');
const { print } = require('../print');
const { parse, validateGrid, validateFullGrid, isSubGrid } = require('../validate');

const SUDOKU_DB_PATH = path.resolve(__dirname, './test_sudokus');
const SUDOKU_DB = [];

function chunkSubstr(str, size) {
	const numChunks = Math.ceil(str.length / size);
	const chunks = new Array(numChunks);
	for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
		chunks[i] = str.substr(o, size);
	}
	return chunks;
}

// Load sudoku database.
walk(SUDOKU_DB_PATH, async (filePath, relPath, fileStat) => {
	if (fileStat.isDirectory()) return;

	let text = fs.readFileSync(filePath, 'utf-8');
	text = text.replace(/\s+/gu, '');
	if ((text.length % 81) !== 0) {
		throw new Error('Invalid input file length.');
	}
	let sudokus = chunkSubstr(text, 81);
	for (let sudoku of sudokus) {
		sudoku = parse(sudoku);
		validateGrid(sudoku);
		SUDOKU_DB.push(sudoku);
	}
}).then(() => {
	let count = 0;
	console.time('sudoku');
	for (let sudoku of SUDOKU_DB) {
		try {
			let sudokuSolved = solve(sudoku);
			validateFullGrid(sudokuSolved);
			if (!isSubGrid(sudoku, sudokuSolved)) throw new Error('The input sudoku is not a sub-grid of the solution.');
		} catch (error) {
			console.timeEnd('sudoku');
			console.log('Failed sudoku:');
			print(sudoku);
			throw error;
		}
		count++;
		console.log(`Solved ${count} sudoku grids.`);
	}
	console.timeEnd('sudoku');
	console.log('Done.');
});
