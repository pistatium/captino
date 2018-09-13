const http = require('http');
const url = require('url');
const puppeteer = require('puppeteer');
const exec = require('child_process').exec;
const fileSystem = require('fs');

const is_valid_url = (str) => {
  var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return pattern.test(str);
}

const capture = async (req_url, w, h, isMobile, isFull) => {
  const path = `/screenshots/tmp.png`;
  const browser = await puppeteer.launch({
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]
    });
	const page = await browser.newPage();
    page.setViewport({width:w, height:h, isMobile:isMobile});
	await page.goto(req_url, {waitUntil: 'networkidle2'});
	await page.screenshot({path: path, fullPage: isFull});
	browser.close();
	return path;
}

const server = http.createServer();
server.on('request', async (req, res) => {
    let params = url.parse(req.url, true).query;
    if (!params.url) return;
    let req_url = params.url.replace('"\n', '');
    let width = (params.width || '1200').parseInt();
    let height = (params.height || '600').parseInt();
    let isMoble = params.isMobile || 0;
    let isFull = params.isFull || 0;

    if (!is_valid_url(req_url)) {
        return res.end('Invalid URL');
    }
    const path = await capture(req_url, width, height, isMobile, isFull);
	let stat = fileSystem.statSync(path);
	res.writeHead(200, {'Content-Type': 'image/png', 'Content-Lenght': stat.size});
	var readStream = fileSystem.createReadStream(path);
	readStream.pipe(res);
});
server.listen(1337, '0.0.0.0');
console.log('Server running at http://127.0.0.1:1337/');
