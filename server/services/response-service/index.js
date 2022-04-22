'use strict';

const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const {__APP, __UPLOAD, parseXslx, log} = require('../../helpers.js');
const parse = require('../../../xls.js')

const uploadFile = __UPLOAD() + '/report.xlsx';

log(uploadFile)

// parse(uploadFile)

// Handlers
class ResponseController {
    async save(client) {
        // log({ client })

        try {
            const bb = busboy({ headers: client.req.headers });

            bb.on('file', (name, file, info) => {
                // console.log({ info })
                // const filename = info.filename;
                // console.log({ filename })
                // client.res.setHeader('File-Upload', filename);
                // try {
                //     const saveTo = path.join(__APP(), `upload/${filename}`);
                //     // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                //     // console.log({ file })
                //     // file.pipe(process.stdout)
                //     console.log({ saveTo })
                //     // console.log(os.tmpdir())
                //     file.pipe(fs.createWriteStream(saveTo));
                // } catch(err) {
                //     console.log({ err })
                // }
            });

            bb.on('field', (name, val, info) => {
                console.log(val);
                const fieldName = `${name}`;
                client.res.setHeader('InputName', fieldName);
            });

            bb.on('close', () => {
                client.res.setHeader('Info-Status', true);
                client.res.writeHead(200, { 'Connection': 'close' });
                client.res.end(`Данные формы получены сервером` );
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

    async parser() {
        log('parser')
    }

    async xslx(client) {
        try {
            let saveTo = '';
            // log('xslx')

            const bb = busboy({ headers: client.req.headers });
            bb.on('file', (name, file, info) => {
                console.log({ info })
                const filename = info.filename;
                console.log({ filename })
                client.res.setHeader('File-Upload', filename);
                try {
                    saveTo = path.join(__UPLOAD(), filename);
                    console.log({ saveTo })
                    // client.res.end(saveTo)
                    // client.res.end(saveTo)
                    // file.pipe(process.stdout)
                    // console.log({ saveTo })
                    // client.res.end(`That's all folks!!!`);

                    const stream = fs.createWriteStream(saveTo);

                    // log({ yu })

                    const res = file.pipe(stream);
                    // log({ res })

                    // parseXslx(saveTo);
                } catch(err) {
                    console.log({ err })
                }
            });
            bb.on('close', () => {
                // log('close')
                // log({ saveTo })
                // parseXslx(saveTo);

                // parse(uploadFile);

                client.res.setHeader('Info-Status', true);
                client.res.setHeader('Content-Type', 'text/html; charset=utf8');
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
