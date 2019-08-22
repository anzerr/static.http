
const Server = require('../index.js');
new Server(3000, __dirname, 'html', true)
	.on('log', console.log)
	.create().then(() => {
		console.log('Server started');
	});
