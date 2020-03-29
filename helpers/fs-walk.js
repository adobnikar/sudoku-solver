'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

/**
 * Recursively walk the given directory and call the handler for each file and directory.
 *
 * @param {string} dir Base directory to walk.
 * @param {function} handler Async handler function.
 * @param {string} [relPath] Path relative to the given base folder.
 */
async function walk(dir, handler, relPath = '') {
	let entries = await readdir(dir);
	for (let entry of entries) {
		let absPath = path.resolve(dir, entry);
		let newRelPath = (relPath.length > 0) ? `${relPath}/${entry}` : entry;
		let fileStat = await stat(absPath);
		if (fileStat && fileStat.isDirectory()) {
			await handler(absPath, newRelPath, fileStat);
			await walk(absPath, handler, newRelPath);
		} else {
			await handler(absPath, newRelPath, fileStat);
		}
	}
}

module.exports = walk;
