
const Static = require('./static.js'),
	path = require('path'),
	fs = require('fs.promisify');

class StaticServer extends require('events') {

	constructor(port, director, type, raw) {
		super();
		this.type = type || null;
		this.raw = raw;
		this.static = new Static(port, director);
	}

	async director(req, res, dir) {
		if (this.type === 'json') {
			let list = await fs.readdir(dir);
			return res.status(200).json(list);
		}
		if (this.type === 'html') {
			let list = await fs.readdir(dir);
			return res.status(200).set({
				'Content-Type': res.type('html')
			}).send(this.static.draw(req.url(), list));
		}
		if (this.type) {
			dir = this.normalize(path.join(req.url(), this.type));
			if ((await fs.stat(dir))) {
				return res.status(200).pipe(fs.createReadStream(dir));
			}
		}
		return res.status(404).send('');
	}

	create() {
		return this.static.create(async (req, res) => {
			if (req.method() === 'GET') {
				this.emit('log', req.url());
				try {
					let dir = this.static.normalize(req.url());
					this.emit('log', dir);
					if ((await fs.stat(dir)).isDirectory()) {
						return this.director(req, res, dir);
					}
					if (this.raw) {
						res.set({
							'Content-Type': res.type(path.extname(dir))
						});
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

	close() {
		this.static.close();
	}

}

module.exports = StaticServer;
