'use strict';

/**
 * Pre calculate groups.
 * There are 9 groups of rows, 9 groups of columns and 9 groups of squares.
 * Pre calculated groups will allow for easier program logic.
 */

const ROWS = [];
const COLUMNS = [];
const SQUARES = [];
for (let i = 0; i < 9; i++) {
	ROWS.push([]);
	COLUMNS.push([]);
	SQUARES.push([]);
}

const REVERSE_ROWS = [];
const REVERSE_COLUMNS = [];
const REVERSE_SQUARES = [];

const REVERSE_ROWS_OFFSET = 0;
const REVERSE_COLUMNS_OFFSET = 1;
const REVERSE_SQUARES_OFFSET = 2;
const ROWS_OFFSET = 9 * REVERSE_ROWS_OFFSET;
const COLUMNS_OFFSET = 9 * REVERSE_COLUMNS_OFFSET;
const SQUARES_OFFSET = 9 * REVERSE_SQUARES_OFFSET;

const GROUPS = [];
const REVERSE_GROUPS = [];
for (let i = 0; i < 27; i++) GROUPS.push([]);

for (let i = 0; i < 81; i++) {
	let column = i % 9;
	let row = Math.floor(i / 9);
	let square = 3 * Math.floor(row / 3) + Math.floor(column / 3);

	ROWS[row].push(i);
	COLUMNS[column].push(i);
	SQUARES[square].push(i);
	REVERSE_ROWS.push(row);
	REVERSE_COLUMNS.push(column);
	REVERSE_SQUARES.push(square);

	GROUPS[ROWS_OFFSET + row].push(i);
	GROUPS[COLUMNS_OFFSET + column].push(i);
	GROUPS[SQUARES_OFFSET + square].push(i);

	let reverse = [null, null, null];
	reverse[REVERSE_ROWS_OFFSET] = ROWS_OFFSET + row;
	reverse[REVERSE_COLUMNS_OFFSET] = COLUMNS_OFFSET + column;
	reverse[REVERSE_SQUARES_OFFSET] = SQUARES_OFFSET + square;
	REVERSE_GROUPS.push(reverse);
}

module.exports = {
	ROWS,
	COLUMNS,
	SQUARES,
	REVERSE_ROWS,
	REVERSE_COLUMNS,
	REVERSE_SQUARES,

	REVERSE_ROWS_OFFSET,
	REVERSE_COLUMNS_OFFSET,
	REVERSE_SQUARES_OFFSET,
	ROWS_OFFSET,
	COLUMNS_OFFSET,
	SQUARES_OFFSET,

	GROUPS,
	REVERSE_GROUPS,
};
