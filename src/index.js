const Server = require('./server.js'),
	fs = require('fs'),
	util = require('util');

let $ = new Server(Number(process.argv[2] || 3000), process.argv[2] || __dirname)
	.create((req, res) => {
		if (req.method === 'get') {
			let dir = $.resolve(req.url);
			util.promisify(fs.stat)(dir).then((res) => {
				console.log(res);
			}).catch(() => {
				res.statusCode = 404;
				res.end('');
			});
		} else {
			res.statusCode = 403;
			res.end('');
		}
	});
