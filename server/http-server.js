'use strict'

// SAF - A simple and flexible server platform for building web applications and services
const fs = require('fs')
const http = require('http');
// const formidable = require('formidable');
// const router = require('find-my-way')();
const Route = require('./routes.js');
const ClientApp = require('./lib/Client/index.js');
const {bufferConcat, replace, memory, notify, log, generateToken, hash} = require('./helpers.js');
const conf = require('./conf.js');
// const {mkd} = require('./lib/Renderer/index.js');
const {mailAdmin} = require('./lib/Mailer/index.js');

process.env.PGHOST = conf.db.host;
process.env.PGUSER = conf.db.user;
process.env.PGDATABASE = conf.db.name;
process.env.PGPASSWORD = conf.db.password;
process.env.PGPORT = conf.db.port;

// console.table(memory())
// log(generateToken());
// log(hash());

const CONTENT_TYPES = {
    IMAGE_JPEG: 'image/jpeg',
    MILTIPART_FORMDATA: 'multipart/form-data',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json;charset=utf-8'
}

const __404 = (res, info = null) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.statusCode = 404;
    res.end(info);
};

const send = (client => {
    const strinfifyData = JSON.stringify(client.data);
    client.res.setHeader('Content-Type', client.mimeType);
    client.res.statusCode = client.statusCode ? statusCode : 200;
    client.res.end(strinfifyData);
});

const response = send;

class Server {
    constructor() {
    }

    response(mimeType, html, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        res.end(html);
    }

    pipe(mimeType, stream, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        stream.pipe(res);
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            const { method, url, headers } = req;
            const client = new ClientApp(req, res);
            const route = new Route(client);

            const hasRoute = route.has();

            // log({ hasRoute })

            if (!hasRoute) {
                __404(res, '404 - ' + client.url);
                notify('404 - ' + req.url, 'Страница не найдена');
            } else {
                if (req.method === 'GET') {

                    // log({ client })

                    const resolve = await route.resolve(client);

                    client.sendCookie()

                    if ((typeof resolve.stream) === 'string') {
                        this.response(client.mimeType, resolve.stream, res);
                    } else {
                        const stream = await resolve.stream;
                        if (stream) {
                            try {
                                this.pipe(client.mimeType, stream, res);
                            } catch(e) {
                                log('error pipe')
                            }
                        } else {
                            __404(res, '404 - ' + client.url);
                            notify('404 - ' + req.url, 'Файл не найден');
                            // log({ stream })
                        }
                    }

                    res.on('finish', () => {
                        if (client.session) {
                            client.session.save()
                            log(`${method} ${url} ${headers.cookie}`)
                            log('')
                            log(client.session)
                        }
                        log('finish')
                        log('---------------------')
                    })
                }

                if (req.method === 'POST') {


                    // Access-Control-Allow-Origin

                    const contentType = req.headers['content-type'];
                    log({ contentType })
                    let body = null;
                    let bodyArr = [];
                    req.on('data', chunk => {
                        if (contentType === CONTENT_TYPES.IMAGE_JPEG) {
                            body += chunk;
                            // bodyArr.push(chunk);
                        }
                        if (contentType === CONTENT_TYPES.FORM_URLENCODED) bodyArr.push(chunk);
                        if (contentType === CONTENT_TYPES.APPLICATION_JSON) body += chunk;
                    });
                    req.on('end', async function () {
                        if (contentType === CONTENT_TYPES.FORM_URLENCODED) {
                            try {
                                body = bufferConcat(bodyArr); // bufferConcat
                                client.body = body;
                                const { stream } = await route.resolve(client);
                                client.data = stream[0];
                                response(client);
                                mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
                            } catch (er) {
                                // bad json
                                res.statusCode = 400;
                                res.end(`error: ${er.message}`);
                            }
                        }
                        if (contentType === CONTENT_TYPES.APPLICATION_JSON) {
                            try {
                                body = replace('null', '', body);
                                // log({ body })
                                client.body = body;
                                const { stream } = await route.resolve(client);
                                client.data = stream[0];
                                response(client);
                                mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
                            } catch (er) {
                                // bad json
                                res.statusCode = 400;
                                res.end(`error: ${er.message}`);
                            }
                        }
                        if (contentType === CONTENT_TYPES.IMAGE_JPEG) {
                            // if (req.url == '/upload') {
                            //     const form = new formidable.IncomingForm();
                            //
                            //     form.parse(req, function (err, fields, files) {
                            //         const oldpath = files.filetoupload.filepath;
                            //         const newpath = './storage/upload/' + files.filetoupload.originalFilename;
                            //
                            //         console.log({ oldpath })
                            //
                            //         console.log({ newpath })
                            //
                            //         fs.rename(oldpath, newpath, function (err) {
                            //             if (err) throw err;
                            //             res.write('File uploaded and moved!');
                            //             res.end();
                            //         });
                            //     });
                            // }

                            // body = bufferConcat(bodyArr); // bufferConcat

                            // log({ body })

                            log(typeof body)

                            fs.writeFile('/Users/sergionov/Projects/transplant.net/node-server/server/new.jpeg', body, function (err) {
                                log('save')

                                if(err)
                                    console.log('NNOOOOOOOOOOOO');
                            });



                            client.body = body;
                            const { stream } = await route.resolve(client);
                            log({ stream })
                            log({ bodyArr })
                            // log({ body })
                        }
                    });
                    req.on('information', (info) => {
                        console.log(`Got information prior to main response: ${info.statusCode}`);
                    });
                }
            }
        });

        // server.on('request', function (req, res) {
        //     log('request')
        //     // logger.run(req, res);
        // });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }

    start(port, host) {
        this.createServer(port, host);
    }
}

// log(util.inspect())
// log('END inspect -------------------------')

module.exports = new Server();
