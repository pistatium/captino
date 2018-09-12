const http = require('http');
const url = require('url');
const exec = require('child_process').exec;
const fileSystem = require('fs');

const is_valid_url = (str) => {
  var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return pattern.test(str);
}

http.createServer(function (req, res) {
    let params = url.parse(req.url, true).query;
    console.log(params);
    if (!params.url) return;
    let req_url = params.url.replace('"\n', '');

    if (!is_valid_url(req_url)) {
        return res.end('Invalid URL');
    }

	exec('node /tools/screenshot.js "' + req_url + '"', (err, stdout, stderr) => {
  		if (err) { console.log(err); }
        console.log(stdout)
  		let path = '/screenshots/' + JSON.parse(stdout).filename;
        console.log(path);
        let stat = fileSystem.statSync(path);
        res.writeHead(200, {'Content-Type': 'image/png', 'Content-Lenght': stat.size});
        var readStream = fileSystem.createReadStream(path);
        readStream.pipe(res);

	}); 
}).listen(1337, '0.0.0.0');
console.log('Server running at http://127.0.0.1:1337/');
