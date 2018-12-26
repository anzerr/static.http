const {Server} = require('http.server'),
	url = require('url'),
	path = require('path');

class Static {

	constructor(port, director) {
		this.port = Number(port);
		this.director = director;
		this._server = new Server(this.port);
	}

	normalize(u) {
		const sanitizePath = path.normalize(url.parse(u).pathname).replace(/^(\.\.[\/\\])+/, '');
		return path.join(this.director, sanitizePath);
	}

	draw(page, json, res) {
		let a = '<style>.a{margin:0px;word-wrap:break-word;white-space:pre-wrap;font-family: monospace;}</style>';
		a += '<pre class="a">[</pre>';
		for (let i in json) {
			a += '<pre class="a">\t<a href="' + path.join(page, json[i]) + '">"' + json[i] + '"</a></pre>';
		}
		return res.status(200).set({
			'Content-Type': res.type('html')
		}).send(a + '<pre class="a">]</pre>');
	}

	create(cd) {
		return this._server.create(cd);
	}

}

module.exports = Static;
