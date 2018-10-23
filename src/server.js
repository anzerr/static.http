const http = require('http'),
	url = require('url'),
	path = require('path');

class Server {

	constructor(port, director) {
		this.port = Number(port);
		this.director = director;
	}

	resolve(u) {
		const sanitizePath = path.normalize(url.parse(u).pathname).replace(/^(\.\.[\/\\])+/, '');
		return path.join(this.director, sanitizePath);
	}

	create(cd) {
		return http.createServer(cd).listen(this.port, () => {
			console.log('started on port: ', this.port);
		});
	}

}

module.exports = Server;
