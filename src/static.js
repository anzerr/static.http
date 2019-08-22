
const {Server} = require('http.server'),
	url = require('url'),
	path = require('path');

class Static {

	constructor(port, director) {
		this.port = Number(port);
		this.director = path.resolve(director);
		this._server = new Server(this.port);
		this._regex = new RegExp('^' + this.director.replace(/(\\|\.){1}/g, '\\$1'));
	}

	normalize(u) {
		const sanitizePath = path.normalize(url.parse(u).pathname).replace(/^(\.\.[\/\\])+/, '');
		let out = path.resolve(path.join(this.director, sanitizePath));
		if (out.match(this._regex)) {
			return out;
		}
		return this.director;
	}

	draw(page, json) {
		let a = '<style>.a{margin:0px;word-wrap:break-word;white-space:pre-wrap;font-family: monospace;}</style>';
		a += '<pre class="a">[</pre>';
		for (let i in json) {
			a += '<pre class="a">\t<a href="' + path.join(page, json[i]) + '">"' + json[i] + '"</a></pre>';
		}
		return a + '<pre class="a">]</pre>';
	}

	create(cd) {
		return this._server.create(cd);
	}

}

module.exports = Static;
