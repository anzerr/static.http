const Static = require('./static.js'),
	path = require('path'),
	fs = require('fs.promisify');

class StaticServer extends require('events') {

	constructor(port, director, type) {
		super();
		this.type = type || null;
		this.static = new Static(port, director);
	}

	async director(req, res, dir) {
		if (this.type === 'json') {
			let list = await fs.readdir(dir);
			return res.status(200).json(list);
		}
		if (this.type === 'html' || this.type === 'raw') {
			let list = await fs.readdir(dir), context = res.type(path.extname(dir) || 'html', res.type('html'));
			return res.status(200).set({
				'Content-Type': context
			}).send(this.static.draw(req.url(), list));
		}
		if (this.type) {
			dir = this.static.normalize(path.join(req.url(), this.type));
			if ((await fs.stat(dir))) {
				return res.status(200).set({
					'Content-Type': res.type(path.extname(dir))
				}).pipe(fs.createReadStream(dir));
			}
		}
		return res.status(404).send('');
	}

	create() {
		return this.static.create(async (req, res) => {
			let dir = this.static.normalize(req.url());
			return Promise.resolve().then(() => {
				if (req.method() === 'GET') {
					this.emit('log', req.url());
					return fs.stat(dir);
				}
			}).then((stat) => {
				if (!stat) {
					return res.status(200).send('');
				}
				this.emit('log', dir);
				if (stat.isDirectory()) {
					return this.director(req, res, dir);
				}
				if (this.type === 'raw') {
					return res.status(200).pipe(fs.createReadStream(dir));
				}
				return res.status(200).set({
					'Content-Type': res.type(path.extname(dir))
				}).pipe(fs.createReadStream(dir));
			}).catch((e) => {
				this.emit('log', e);
				res.status(404).send('');
			});
		}).then(() => {
			this.emit('log', 'http server listening to port', this.static.port, this.static.director);
		});
	}

}

module.exports = StaticServer;
