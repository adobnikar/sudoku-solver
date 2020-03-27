'use strict';

const CHAR_CODE_1 = '1'.charCodeAt(0);
const CHAR_CODE_9 = '9'.charCodeAt(0);

const isString = require('lodash.isstring');
const isArray = require('lodash.isarray');

const {
	REVERSE_ROWS_OFFSET,
	REVERSE_COLUMNS_OFFSET,
	REVERSE_SQUARES_OFFSET,
	ROWS_OFFSET,
	COLUMNS_OFFSET,
	SQUARES_OFFSET,
	REVERSE_GROUPS,
} = require('./groups');

/**
 * Validate sudoku grid state.
 *
 * @param {integer[]} sudoku Input must be an array of integers.
 * @param {boolean} [requireFull=false] Require the grid to be full.
 */
function validateGrid(sudoku, requireFull = false) {
	if (sudoku.length !== 81) {
		throw new Error('Invalid sudoku grid length.');
	}
	let groups = [];
	for (let i = 0; i < 27; i++) groups.push([false, false, false, false, false, false, false, false, false]);
	for (let inx = 0; inx < 81; inx++) {
		let val = sudoku[inx];
		if (val == null) {
			if (requireFull) throw new Error('Grid is not full.');
			continue;
		} else if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(val)) {
			throw new Error(`Invalid value in the sudoku grid "${val}".`);
		}

		let gInx = REVERSE_GROUPS[inx];

		if (groups[gInx[REVERSE_ROWS_OFFSET]][val - 1]) {
			throw new Error(`Duplicate value "${val}" in row ${gInx[REVERSE_ROWS_OFFSET] - ROWS_OFFSET + 1}.`);
		}
		groups[gInx[REVERSE_ROWS_OFFSET]][val - 1] = true;

		if (groups[gInx[REVERSE_COLUMNS_OFFSET]][val - 1]) {
			throw new Error(`Duplicate value "${val}" in column ${gInx[REVERSE_COLUMNS_OFFSET] - COLUMNS_OFFSET + 1}.`);
		}
		groups[gInx[REVERSE_COLUMNS_OFFSET]][val - 1] = true;

		if (groups[gInx[REVERSE_SQUARES_OFFSET]][val - 1]) {
			throw new Error(`Duplicate value "${val}" in square ${gInx[REVERSE_SQUARES_OFFSET] - SQUARES_OFFSET + 1}.`);
		}
		groups[gInx[REVERSE_SQUARES_OFFSET]][val - 1] = true;
	}
}

/**
 * Validate full sudoku grid.
 *
 * @param {integer[]} sudoku Input must be an array of integers.
 */
function validateFullGrid(sudoku) {
	return validateGrid(sudoku, true);
}

/**
 * Check if a sudoku grid is a sub-grid of another.
 *
 * @param {integer[]} sudokuA Sub-grid.
 * @param {integer[]} sudokuB Parent grid.
 */
function isSubGrid(sudokuA, sudokuB) {
	if ((sudokuA.length !== 81) || (sudokuB.length !== 81)) {
		throw new Error('Invalid sudoku grid length.');
	}
	for (let inx = 0; inx < 81; inx++) {
		if (sudokuA[inx] == null) continue;
		if (sudokuA[inx] !== sudokuB[inx]) return false;
	}
	return true;
}

/**
 * Parse a sudoku grid.
 *
 * @param {string} text String must contain 81 elements. Whitespace will be ignored.
 */
function parse(text) {
	text = text.replace(/\s+/gu, '');
	if (text.length !== 81) {
		throw new Error('Invalid input length.');
	}

	let sudoku = [];
	for (let i = 0; i < 81; i++) {
		let charCode = text.charCodeAt(i);
		if ((charCode < CHAR_CODE_1) || (charCode > CHAR_CODE_9)) {
			sudoku.push(null);
		} else {
			sudoku.push(charCode - CHAR_CODE_1 + 1);
		}
	}
	return sudoku;
}

/**
 * Validate input.
 *
 * @param {string|integer[]} input Input must be a string or an array of integers.
 */
function validateInput(input) {
	if (isString(input)) {
		let sudoku = parse(input);
		return sudoku;
	} else if (isArray(input)) {
		if (input.length !== 81) {
			throw new Error('Invalid input length.');
		}
		let sudoku = input.map(val => {
			if ([null, 0].includes(val)) {
				return null;
			} else if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(val)) {
				return val;
			} else {
				throw new Error(`Invalid element in the input array "${val}".`);
			}
		});
		return sudoku;
	}
	throw new Error('Invalid input. Input must be a string or an array of integers.');
}

module.exports = {
	validateGrid,
	validateFullGrid,
	isSubGrid,
	parse,
	validateInput,
};
