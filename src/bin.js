#!/usr/bin/env node

const {Cli, Map} = require('cli.util'),
	Server = require('./server.js');

let cli = new Cli(process.argv, [
	new Map('port').alias(['p', 'P']).arg(),
	new Map('cwd').alias(['c']).arg(),
]);

new Server(Number(cli.get('port') || 3000), cli.get('cwd') || __dirname, cli.get('type'))
	.on('log', console.log)
	.create().then(() => {
		console.log('Server started');
	});
