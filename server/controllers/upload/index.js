const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const {log, __VIEWS, __SERVER, __UPLOAD} = require('../../helpers.js');
// const nunjucks = require('nunjucks');

log(__SERVER())

const dto = require(__SERVER() + '/lib/DTO/index.js');
const { tmpl } = require(__SERVER() + '/lib/Renderer/index.js');

// nunjucks.configure(__VIEWS(), { autoescape: true });

// const cached = new Map();
// const cachedHTML = new Map();

// Handlers
class UploadControllers {
    async index() {
        const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        return dto.stream(render);

    }

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
                    const saveTo = path.join(__UPLOAD(), filename);
                    // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                    // console.log({ file })
                    // file.pipe(process.stdout)
                    console.log({ saveTo })
                    // console.log(os.tmpdir())
                    file.pipe(fs.createWriteStream(saveTo));
                } catch(err) {
                    console.log({ err })
                }
            });

            bb.on('field', (name, val, info) => {
                // console.log({ info })
                console.log(`Field [${name}]: value: %j`, val);
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
            return;
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
            // return {foo:'bar'}
        }

        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);

    }
}

const uploadController = new UploadControllers();

module.exports = { uploadController };
