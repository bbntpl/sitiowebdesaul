const http = require('http');
const fs = require('fs');

// allocating some pseudo-cached images to the memory
const cache = {};
const files = [
	{
		url: '/',
		path: 'pages/index.html',
		contentType: 'text/html',
	},
	{
		url: '/about',
		path: 'pages/about.html',
		contentType: 'text/html'
	},
	{
		url: '/contact-me',
		path: 'pages/contact-me.html',
		contentType: 'text/html'
	},
	{
		url: '/styles.css',
		path: 'styles.css',
		contentType: 'text/css'
	},
	{
		url: '/images/saul.jpg',
		path: 'images/saul.jpg',
		contentType: 'image/jpeg'
	},
	{
		url: '/images/ad.jpg',
		path: 'images/ad.jpg',
		contentType: 'image/jpeg'
	},
	{
		url: '/images/hero.jpg',
		path: 'images/hero.jpg',
		contentType: 'image/jpeg'
	},
	{
		url: '/images/justice.jpg',
		path: 'images/justice.jpg',
		contentType: 'image/jpeg'
	},
	{
		url: '/images/HOWDAREYOUUUU.png',
		path: 'images/HOWDAREYOUUUU.png',
		contentType: 'image/png'
	},
	{
		url: '/fonts/script1-script-casual-normal.ttf',
		path: 'fonts/script1-script-casual-normal.ttf',
		contentType: 'application/x-font-ttf'
	}
]

const handleNotFound = (res) => {
	fs.readFile('pages/404.html', (err, data) => {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		if (err) {
			res.write(err)
		} else {
			res.write(data);
		}
		res.end()
	});
}

// const readAudio = (file) => {
// 	const audioFileStream = fs.createReadStream(file.path);
// 	res.writeHead(200, {
// 		'Content-Type': 'audio/mpeg',
// 	});
// 	audioFileStream.pipe(res);
// }

const readingError = (res) => {
	res.writeHead(500);
	res.write('Error: File reading error!');
	res.end();
}

const handleRoute = (file, res) => {
	if (file.contentType.includes('image') && cache[file.path]) {
		// Serve the cached image
		res.writeHead(200, { 'Content-Type': file.contentType });
		res.end(cache[file.path]);
	}
	//  else if (file.contentType.includes('audio')) {
	// 	readAudio(file)
	// }
	else {
		fs.readFile(file.path, (err, data) => {
			if (err) {
				readingError(res)
			} else {
				res.writeHead(200, { 'Content-Type': file.contentType });
				if (file.contentType.includes('image')) {
					// Cache the image before sending the response
					cache[file.path] = data;
					res.end(data);
				} else {
					res.write(data);
					res.end();
				}
			}
		})
	}
}

// Create the server
const server = http.createServer((req, res) => {
	let processedFiles = 0

	// For every request, read the file accordingly
	files.forEach(file => {
		if (req.url === file.url) {
			handleRoute(file, res)
			processedFiles++
		}
	});

	// respond with 404 not found page if no files are processed
	if (processedFiles === 0) {
		handleNotFound(res)
	}
});

server.on('error', (error) => {
	console.error(`Server error: ${error}`);
});

server.listen(3000, () => {
	console.log('Server running on http://localhost:3000/');
});