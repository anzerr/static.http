
### `Intro`
![GitHub Actions status | publish](https://github.com/anzerr/static.http/workflows/publish/badge.svg)

Simple file explorer in NodeJS with zero dependencies

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/static.http.git
npm install --save @anzerr/static.http
```

``` bash
git clone git+https://git@github.com/anzerr/static.http.git &&
cd static.http &&
npm link
```

### `Example`
``` bash
staticserver --port 8080 --cwd ..
```

``` javascript
const Server = require('static.http');
const type = ['json', 'html', 'index.html'];
new Server(5996, __dirname, type[1])
	.on('log', console.log)
	.create().then(() => {
		console.log('Server started');
	});
```