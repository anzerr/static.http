#!/usr/bin/env node

const Cli = require('cli.util'),
	Server = require('./server.js');

let cli = new Cli(process.argv, {
	port: ['p', 'P'],
	cwd: ['c']
});

new Server(Number(cli.get('port') || 3000), cli.get('cwd') || __dirname)
	.on('log', console.log)
	.create().then(() => {
		console.log('Server started');
	});
