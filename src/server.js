const http = require('http'),
	url = require('url'),
	path = require('path'),
	Response = require('./response.js');

class Server {

	constructor(port, director) {
		this.port = Number(port);
		this.director = director;
		this.handle = [];
	}

	resolve(u) {
		const sanitizePath = path.normalize(url.parse(u).pathname).replace(/^(\.\.[\/\\])+/, '');
		return path.join(this.director, sanitizePath);
	}

	jsonToHtml(page, json, res) {
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
		return new Promise((resolve) => {
			let server = this.handle.push(http.createServer((req, res) => {
				return cd(req, new Response(res));
			}).listen(this.port, () => {
				resolve(server);
			}));
		});
	}

}

module.exports = Server;
