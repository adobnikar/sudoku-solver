'use strict';

const assert = require('assert');
const { parse } = require('../validate');
const { fullMask, maskFromGrid, maskFromIndexes, maskToIndexes } = require('../masks');

let test = `483921657
			967345821
			251876493
			548132976
			729564138
			136798245
			372689514
			814253769
			695417382`;

let sudoku = parse(test);
let inxSet = new Set();
for (let n = 1; n <= 9; n++) {
	let mask = maskFromGrid(sudoku, v => v === n);
	let indexes = maskToIndexes(mask);
	if (indexes.length !== 9) throw new Error('Invalid mask length. There must be 9 indexes for each number.');
	for (let inx of indexes) {
		if ((inx < 0) || (inx >= 81)) throw new Error(`Index out of range "${inx}".`);
		if (inxSet.has(inx)) throw new Error(`Duplicate index "${inx}".`);
		inxSet.add(inx);
	}
	let mask2 = maskFromIndexes(indexes);
	assert.deepStrictEqual(mask2, mask);
}

let fullIndexes = maskToIndexes(fullMask());
if (fullIndexes.length !== 81) throw new Error('Invalid full mask length. There must be 81 indexes in a full mask.');
for (let i = 0; i < 81; i++) {
	if (fullIndexes[i] !== i) throw new Error(`Invalid index in the full mask "${fullIndexes[i]}".`);
}

console.log('Done.');
