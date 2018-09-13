const http = require('http');
const url = require('url');
const puppeteer = require('puppeteer');
const exec = require('child_process').exec;
const fileSystem = require('fs');

const is_valid_url = (str) => {
  const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return pattern.test(str);
}

const capture = async (req_url, w, h, mobile, full) => {
  const path = `/screenshots/tmp.png`;
  const browser = await puppeteer.launch({
        args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
        ]
    });
	const page = await browser.newPage();
    let err = null;
    page.setViewport({width:w, height:h, isMobile:mobile});
	await page.goto(req_url, {waitUntil: 'networkidle2'}).catch((e) => {err = e});
	await page.screenshot({path: path, fullPage: full});
	browser.close();
	return [path, err];
}

const server = http.createServer();
server.on('request', async (req, res) => {
    let parsed = url.parse(req.url, true);
    let params = parsed.query;
    if (parsed.pathname !== '/capture') {
        res.statusCode = 404;
        return res.end('<a href="/capture?url=https://google.com">Try it.</a>');
    }
    if (!params.url) {
        res.statusCode = 400;
        return res.end('`url` is required');
    }
    let req_url = params.url.replace('"\n', '');
    let width = parseInt(params.width || '1200');
    let height = parseInt(params.height || '800');
    let mobile = Boolean(params.mobile);
    let full = Boolean(params.full);

    if (!is_valid_url(req_url)) {
        res.statusCode = 400;
        return res.end('Invalid URL');
    }
    console.log('Capturing: ' + req_url);
    const [path, err] = await capture(req_url, width, height, mobile, full);
    if (err) {
        console.log(err);
        res.statusCode = 500;
        return res.end('Capture error:\n ' + err.message.split("\n")[0]);
    }
	let stat = fileSystem.statSync(path);
	res.writeHead(200, {'Content-Type': 'image/png', 'Content-Lenght': stat.size});
	var readStream = fileSystem.createReadStream(path);
	readStream.pipe(res);
});
server.listen(8000, '0.0.0.0');
console.log('Server running at http://0.0.0.0:8000/');
