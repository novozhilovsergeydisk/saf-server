const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const {__APP} = require('../../helpers.js');

// Handlers
class ResponseController {
    async upload(client) {
        // log({ client })

        try {
            const bb = busboy({ headers: client.req.headers });
            bb.on('file', (name, file, info) => {
                // console.log({ info })
                const filename = info.filename;
                console.log({ filename })
                client.res.setHeader('File-Upload', filename);
                try {
                    const saveTo = path.join(__APP(), `upload/${filename}`);
                    // file.pipe(process.stdout)
                    // console.log({ saveTo })
                    file.pipe(fs.createWriteStream(saveTo));
                } catch(err) {
                    console.log({ err })
                }
            });
            bb.on('field', (name, val, info) => {
                // console.log({ info })
                // console.log(`Field [${name}]: value: %j`, val);
                // params.set(name, val);
                client.res.setHeader(`Field-${name}`, `${val}`);
            });
            bb.on('close', () => {
                client.res.setHeader('Info-Status', true);
                client.res.writeHead(200, { 'Connection': 'close' });
                client.res.end(`Файл успешно загружен на сервер` );
                // return `That's all folks!!!`;
                // res.writeHead(200, { 'Connection': 'close' });
                // res.end(`That's all folks!!!`);
            });
            client.req.pipe(bb);
            return { foo: 'bar' }
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
            return { major: 'error' }
        }

        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);

    }
}

const responseController = new ResponseController();

module.exports = { responseController };
