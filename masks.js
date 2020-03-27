'use strict';

const { REVERSE_GROUPS } = require('./groups');

/**
 * Basic elements.
 */

function fullMask() {
	return [0x7FFFFFF, 0x7FFFFFF, 0x7FFFFFF];
}

function emptyMask() {
	return [0, 0, 0];
}

/**
 * Mask converter functions.
 */

function maskFromGrid(grid, conditionFn) {
	let mask = [0, 0];
	for (let i = 0; i < 27; i++) {
		if (!conditionFn(grid[i])) continue;
		mask[0] |= 1 << i;
	}
	for (let i = 27; i < 54; i++) {
		if (!conditionFn(grid[i])) continue;
		mask[1] |= 1 << (i - 27);
	}
	for (let i = 54; i < 81; i++) {
		if (!conditionFn(grid[i])) continue;
		mask[2] |= 1 << (i - 54);
	}
	return mask;
}

function maskFromIndexes(indexes) {
	let mask = emptyMask();
	for (let inx of indexes) {
		if (inx < 27) mask[0] |= 1 << inx;
		else if (inx < 54) mask[1] |= 1 << (inx - 27);
		else mask[2] |= 1 << (inx - 54);
	}
	return mask;
}

function maskToIndexes(mask) {
	let indexes = [];
	for (let i = 0; i < 27; i++) {
		if (((1 << i) & mask[0]) > 0) indexes.push(i);
	}
	for (let i = 27; i < 54; i++) {
		if (((1 << (i - 27)) & mask[1]) > 0) indexes.push(i);
	}
	for (let i = 54; i < 81; i++) {
		if (((1 << (i - 54)) & mask[2]) > 0) indexes.push(i);
	}
	return indexes;
}

/**
 * Pre-calculate all possible masks for a single number.
 * All 81 bits of a mask are store in three numbers. 27 bits in the first number, 27 in the second and 27 in the third number.
 */

const MASKS_COMBO_COUNT = 9 * 6 * 3 * 6 * 4 * 2 * 3 * 2;
const MASKS = [];

function generate(groupFlags, indexes = []) {
	let row = indexes.length;
	if (row >= 9) {
		MASKS.push(maskFromIndexes(indexes));
		return;
	}

	for (let i = 0; i < 9; i++) {
		let inx = 9 * row + i;
		let groups = REVERSE_GROUPS[inx];
		let occupied = groups.map(g => groupFlags[g]).reduce((a, b) => a || b, false);
		if (occupied) continue;

		indexes.push(inx);
		for (let g of groups) groupFlags[g] = true;
		generate(groupFlags, indexes);
		for (let g of groups) groupFlags[g] = false;
		indexes.pop();
	}
}
generate(new Array(27).fill(false));

if (MASKS.length !== MASKS_COMBO_COUNT) {
	throw new Error('Error generating number masks.');
}

/**
 * Mask operations.
 */

function isEmpty(mask) {
	return (mask[0] <= 0) & (mask[1] <= 0) & (mask[2] <= 0);
}

function isOverlapping(maskA, maskB) {
	if ((maskA[0] & maskB[0]) > 0) return true;
	if ((maskA[1] & maskB[1]) > 0) return true;
	if ((maskA[2] & maskB[2]) > 0) return true;
	return false;
}

function isSubset(maskSub, maskSuper) {
	if ((maskSub[0] & maskSuper[0]) !== maskSub[0]) return false;
	if ((maskSub[1] & maskSuper[1]) !== maskSub[1]) return false;
	if ((maskSub[2] & maskSuper[2]) !== maskSub[2]) return false;
	return true;
}

function intersect(maskA, maskB) {
	return [maskA[0] & maskB[0], maskA[1] & maskB[1], maskA[2] & maskB[2]];
}

function union(maskA, maskB) {
	return [maskA[0] | maskB[0], maskA[1] | maskB[1], maskA[2] | maskB[2]];
}

function subtract(maskA, maskB) {
	return [maskA[0] & ~maskB[0], maskA[1] & ~maskB[1], maskA[2] & ~maskB[2]];
}

module.exports = {
	emptyMask,
	fullMask,

	maskFromGrid,
	maskFromIndexes,
	maskToIndexes,

	MASKS_COMBO_COUNT,
	MASKS,

	isEmpty,
	isOverlapping,
	isSubset,
	intersect,
	union,
	subtract,
};
