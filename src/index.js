const Server = require('./server.js'),
	fs = require('fs'),
	util = require('util');

const json = false;

let $ = new Server(Number(process.argv[2] || 3000), process.argv[3] || __dirname);
$.create((req, res) => {
	if (req.method === 'GET') {
		let dir = $.resolve(req.url);
		console.log(dir);
		util.promisify(fs.stat)(dir).then((stat) => {
			if (stat.isDirectory()) {
				return util.promisify(fs.readdir)(dir);
			}
			return fs.createReadStream(dir);
		}).then((list) => {
			if (Array.isArray(list)) {
				if (json) {
					return res.status(200).json(list);
				}
				return $.jsonToHtml(req.url, list, res);
			}
			return res.status(200).pipe(list);
		}).catch((e) => {
			console.log('error', e);
			res.status(404).send('');
		});
	} else {
		res.status(403).send('');
	}
}).then(() => {
	console.log('http server listening to port', $.port);
});
