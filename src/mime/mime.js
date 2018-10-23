const data = require('./data.js'),
	path = require('path');

class Mime {

	constructor() {}

	filelookup(file) {
		return this.lookup(path.parse(file).ext);
	}

	lookup(ext) {
		return data.extension[(ext[0] === '.') ? ext.substring(1) : ext];
	}

}

module.exports = new Mime();
