
const Server = require('../index.js');
const s = new Server(3000, __dirname, 'html', true);
s.on('log', console.log).create().then(() => {
	console.log('Server started');
	setTimeout(() => {
		s.close();
	}, 10000);
});
