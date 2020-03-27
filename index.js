'use strict';

const { print } = require('./print');
const { validateInput } = require('./validate');
const {
	maskFromIndexes,
	maskToIndexes,
	MASKS,
	isEmpty,
	isOverlapping,
	isSubset,
	intersect,
	union,
	subtract,
} = require('./masks');

function calcNumMasks(sudoku) {
	let fullMask = [];
	let numberMasks = [];
	for (let i = 0; i < 9; i++) numberMasks.push([]);

	for (let inx = 0; inx < 81; inx++) {
		if (sudoku[inx] == null) continue;
		fullMask.push(inx);
		numberMasks[sudoku[inx] - 1].push(inx);
	}
	fullMask = maskFromIndexes(fullMask);

	let numberNegativeMasks = [];
	for (let i = 0; i < 9; i++) {
		let mask = maskFromIndexes(numberMasks[i]);
		numberMasks[i] = mask;
		numberNegativeMasks.push(subtract(fullMask, mask));
	}

	return {
		numberMasks,
		numberNegativeMasks,
	};
}

function countMissingNumbers(sudoku) {
	let numbers = [];
	for (let n = 1; n <= 9; n++) {
		numbers.push({ n: n, count: 0 });
	}
	for (let inx = 0; inx < 81; inx++) {
		if (sudoku[inx] == null) continue;
		let n = sudoku[inx];
		numbers[n - 1].count++;
	}
	numbers = numbers.filter(num => num.count < 9);
	numbers.sort((a, b) => b.count - a.count);
	return numbers;
}

/**
 * Solve a sudoku grid.
 *
 * @param {string|integer[]} input Input must be a string or an array of integers.
 * @param {boolean} [printSteps=false] Print solution steps.
 */
function solve(input, printSteps = false) {
	let sudoku = validateInput(input);
	if (printSteps) print(sudoku);

	let numbers = countMissingNumbers(sudoku);
	if (numbers.length <= 0) return sudoku;
	// TODO: Maybe only re-calculate masks for the missing numbers.
	let { numberMasks, numberNegativeMasks } = calcNumMasks(sudoku);
	let emptyRounds = 0;
	while (numbers.length > 0) {
		let num = numbers.shift();
		let n = num.n;
		let nMask = numberMasks[n - 1];
		let nnMask = numberNegativeMasks[n - 1];
		let inter = null;
		// TODO: Remember the list of remaining masks.
		for (let mask of MASKS) {
			if (!isSubset(nMask, mask)) continue;
			if (isOverlapping(nnMask, mask)) continue;
			if (inter == null) inter = mask;
			else inter = intersect(inter, mask);
		}

		if (inter == null) {
			throw new Error('This sudoku grid has not solutions.');
		}

		// Get the new fixed indexes.
		let indexesMask = subtract(inter, nMask);
		if (isEmpty(indexesMask)) {
			if (printSteps) {
				console.log('');
				console.log(`No new entries for ${n}.`);
			}
			numbers.push(num);
			emptyRounds++;
			if (emptyRounds < numbers.length) continue;
			throw new Error('This algorithm could not found the complete solution to this sudoku grid.');
		}
		let indexes = maskToIndexes(indexesMask);
		emptyRounds = 0;

		// Enter the new numbers.
		num.count += indexes.length;
		if (num.count < 9) numbers.push(num);
		for (let inx of indexes) {
			sudoku[inx] = n;
		}

		// Re-calc the number masks.
		numberMasks[n - 1] = union(numberMasks[n - 1], indexesMask);
		for (let nNum of numbers) {
			if (nNum.n === n) continue;
			numberNegativeMasks[nNum.n - 1] = union(numberNegativeMasks[nNum.n - 1], indexesMask);
		}

		// Print the state of the sudoku grid.
		if (printSteps) {
			console.log('');
			console.log(`Add ${n} to indexes ${indexes.join(', ')}.`);
			console.log('');
			print(sudoku);
			console.log('');
		}
	}

	return sudoku;
}

module.exports = {
	print,
	solve,
};
