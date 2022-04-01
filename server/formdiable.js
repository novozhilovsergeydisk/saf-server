const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

const bufferConcat = (body => {
    const bufConcat = Buffer.concat(body).toString();
    // log({ bufConcat });
    const bufArray = bufConcat.split('&');
    // log({ bufArray });
    let json = {};
    let arr = [];
    bufArray.map((item) => {
        arr = item.split('=');
        json[arr[0]] = arr[1];
        // log({ item });
    });
    // log({ json });
    return json;
});

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        const form = new formidable.IncomingForm();

        // console.log({ form })

        console.log({ 'req.method': req.method })

        if (req.method === 'POST') {
            let contentType = req.headers['content-type'];
            console.log({ contentType })
            // log(CONTENT_TYPES.MULTIPART_FORMDATA)
            let body = null;
            let bodyArr = [];
            req.on('data', chunk => {
                bodyArr.push(chunk)
                // if (contentType === 'multipart/form-data') bodyArr.push(chunk);
            });
            req.on('end', async function () {
                body = bufferConcat(bodyArr); // bufferConcat

                // fs.writeFile('/Users/sergionov/Projects/transplant.net/node-server/server/new2.jpeg', body, function (err) {
                //     log('save')
                //
                //     if(err)
                //         console.log('NNOOOOOOOOOOOO');
                // });

                // console.log({ body })

                // if (contentType === 'multipart/form-data') {
                //     try {
                //         // log('vbnbnbnfghrt456gfgfgf')
                //
                //         body = bufferConcat(bodyArr); // bufferConcat
                //         console.log({ body })
                //         // client.body = body;
                //         // const { stream } = await route.resolve(client);
                //         // client.data = stream[0];
                //         //
                //         // body.forEach(item => {
                //         //     log({ item })∂
                //         // })
                //
                //         console.log(typeof body)
                //
                //         // fs.writeFile('/Users/sergionov/Projects/transplant.net/node-server/server/xxx.png', body, function (err) {
                //         //     log('save png')
                //         //
                //         //     if(err)
                //         //         console.log('NNOOOOOOOOOOOO');
                //         // });
                //         // response(client);
                //         // mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
                //     } catch (er) {
                //         // bad json
                //         res.statusCode = 400;
                //         res.end(`error: ${er.message}`);
                //     }
                // }

            });
            req.on('information', (info) => {
                console.log(`Got information prior to main response: ${info.statusCode}`);
            });
        }

        form.parse(req, function (err, fields, files) {
            const oldpath = files.filetoupload.filepath;
            const newpath = './storage/upload/' + files.filetoupload.originalFilename;

            console.log({ fields })

            console.log({ files })

            // console.log({ oldpath })
            //
            // console.log({ newpath })

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);