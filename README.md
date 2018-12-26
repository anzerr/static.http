
### `Intro`
Simple file explorer in NodeJS with zero dependencies

#### `Install`
``` bash
npm install --save git+ssh://git@github.com/anzerr/static.http.git
```

``` bash
git clone git+ssh://git@github.com/anzerr/static.http.git &&
cd static.http &&
npm link
```

### `Example`

``` bash
staticserver --port 8080 --cwd ..
```

``` javascript
const Server = require('static.http');
new Server(5996, __dirname)
	.on('log', console.log)
	.create().then(() => {
		console.log('Server started');
	});
```