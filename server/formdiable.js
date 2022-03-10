const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        const form = new formidable.IncomingForm();

        // console.log({ form })

        form.parse(req, function (err, fields, files) {
            const oldpath = files.filetoupload.filepath;
            const newpath = './storage/upload/' + files.filetoupload.originalFilename;

            console.log({ oldpath })

            console.log({ newpath })

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        // res.writeHead(200, {'Content-Type': 'text/html'});
        // res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        // res.write('<input type="file" name="filetoupload"><br>');
        // res.write('<input type="submit">');
        // res.write('</form>');
        // return res.end();
    }
}).listen(8080);