const http = require('http');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
// const XLSX = require('xlsx');
// const formidable = require('formidable');
const {log, __UPLOAD} = require('./server/helpers.js');
const PORT = 3002;
let html = '';

// let extmap = {};

http.createServer(function(req, res) {
	if(req.method !== 'POST') return res.end(html);

    try {
        const bb = busboy({ headers: req.headers });
        bb.on('file', (name, file, info) => {
            console.log({ info })
            const filename = info.filename;
            console.log({ filename })
            res.setHeader('File-Upload', filename);
            try {
                log(__UPLOAD())
                const saveTo = path.join(__UPLOAD(), filename);
                // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                // console.log({ file })
                // file.pipe(process.stdout)
                log({ saveTo })
                // console.log(os.tmpdir())
                file.pipe(fs.createWriteStream(saveTo));
            } catch(err) {
                log({ err })
            }
        });

        bb.on('field', (name, val, info) => {
            // console.log({ info })
            log(`Field [${name}]: value: %j`, val);
            // params.set(name, val);
            res.setHeader(`Field-${name}`, `${val}`);
        });

        bb.on('close', () => {
            res.setHeader('Info-Status', true);
            res.writeHead(200, { 'Connection': 'close' });
            res.end(`Файл успешно загружен на сервер` );
            // return `That's all folks!!!`;
            // res.writeHead(200, { 'Connection': 'close' });
            // res.end(`That's all folks!!!`);
        });
        req.pipe(bb);
        return;
    } catch(err) {
        log({ err })
		res.writeHead(500, { 'Connection': 'close' });
        res.end(`${err}`);
        // return {foo:'bar'}
    }

	// const form = new formidable.IncomingForm();
	// form.parse(req, function(err, fields, files) {
	// 	const f = files[Object.keys(files)[0]];
	// 	// const fPath = f.path;
	//
	// 	const realFile = '/Users/sergionov/Projects/transplant.net/node-server/static/img/test.xlsx';
	//
    //     // console.log({ f })
	//
	//
	// 	// console.log({ 'typeof f': typeof f } )
	//
	//
	// 	const wb = XLSX.readFile(realFile);
	// 	const ext = (fields.bookType || "xlsx").toLowerCase();
	//
    //     console.log({ ext })
	//
	// 	res.setHeader('Content-Disposition', 'attachment; filename="download.' + (extmap[ext] || ext) + '";');
	//
	// 	res.end('test');
	// 	// res.end(XLSX.write(wb, {type:"buffer", bookType:ext}));
	// });
}).listen(PORT);

html = [
'<pre>',
'<h3><a href="http://sheetjs.com/">SheetJS File Converter</a></h3>',
'Upload a file to convert the contents to another format.',
'',
'<b>Form Fields</b>:',
'- bookType: output format type (defaults to "XLSX")',
'- basename: basename for output file (defaults to "download")',
'',
'<form method="POST" enctype="multipart/form-data" action="/">',
'<input type="file" id="file" name="file"/>',
'<select id="bookType" name="bookType">',
[
	["xlsb",  "XLSX"],
	["xlsx",  "XLSB"],
	["xlsm",  "XLSM"],
	["biff8", "BIFF8 XLS"],
	["biff5", "BIFF5 XLS"],
	["biff2", "BIFF2 XLS"],
	["xlml",  "SSML 2003"],
	["ods",   "ODS"],
	["fods",  "Flat ODS"],
	["csv",   "CSV"],
	["txt",   "Unicode Text"],
	["sylk",  "Symbolic Link"],
	["html",  "HTML"],
	["dif",   "DIF"],
	["dbf",   "DBF"],
	["rtf",   "RTF"],
	["prn",   "Lotus PRN"],
	["eth",   "Ethercalc"],
].map(function(x) { return '  <option value="' + x[0] + '">' + x[1] + '</option>'; }).join("\n"),
'</select>',
'<input type="submit" value="Submit Form">',
'</form>',
'',
'<b>Form code:</b>',
'&lt;form method="POST" enctype="multipart/form-data" action="/"&gt;',
'&lt;input type="file" id="file" name="file"/&gt;',
'&lt;select name="bookType"&gt',
'&lt;!-- options here --&gt;',
'&lt;/select&gt',
'&lt;input type="submit" value="Submit Form"&gt;',
'&lt;/form&gt;',
'',
'<b>fetch Code:</b>',
'const blob = new Blob("1,2,3\\n4,5,6".split("")); // original file',
'const fd = new FormData();',
'fd.set("data", blob, "foo.bar");',
'fd.set("bookType", "xlsb");',
'const res = await fetch("/", {method:"POST", body:fd});',
'const data = await res.arrayBuffer();',
'</pre>'
].join("\n");

extmap = {
	"biff2" : "xls",
	"biff5" : "xls",
	"biff8" : "xls",
	"xlml"  : "xls"
};
log('listening on port ' + PORT);
