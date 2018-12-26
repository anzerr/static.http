const Static = require('./static.js'),
	fs = require('fs.promisify');

class StaticServer extends require('events') {

	constructor(port, director, json) {
		super();
		this.json = json;
		this.static = new Static(port, director);
	}

	create() {
		return this.static.create(async (req, res) => {
			if (req.method() === 'GET') {
				try {
					let dir = this.static.normalize(req.url());
					this.emit('log', dir);
					if ((await fs.stat(dir)).isDirectory()) {
						let list = await fs.readdir(dir);
						return (this.json) ? res.status(200).json(list) : this.static.draw(req.url(), list, res);
					}
					res.status(200).pipe(fs.createReadStream(dir));
				} catch (e) {
					this.emit('log', e);
					res.status(404).send('');
				}
			} else {
				res.status(200).send('');
			}
		}).then(() => {
			this.emit('log', 'http server listening to port', this.static.port, this.static.director);
		});
	}

}

module.exports = StaticServer;
