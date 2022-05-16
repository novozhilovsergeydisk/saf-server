'use strict';

const conf = require('./conf.js');
process.env.PGHOST = conf.db.host;
process.env.PGUSER = conf.db.user;
process.env.PGDATABASE = conf.db.name;
process.env.PGPASSWORD = conf.db.password;
process.env.PGPORT = conf.db.port;

process.env.JWT_ACCESS_TOKEN = conf.jwt_access_token;
process.env.JWT_REFRESH_TOKEN = conf.jwt_refresh_token;

// SAF - A simple and flexible server platform for building web applications and services
const fs = require('fs');
const http = require('http');

const { faker } = require('@faker-js/faker');

// const formidable = require('formidable');
// const router = require('find-my-way')();
const Route = require('./routes.js');
const ClientApp = require('./lib/Client/index.js');
const {bufferConcat, replace, memory, notify, log, generateToken, hash, httpMethods, query} = require('./helpers.js');
// const {mkd} = require('./lib/Renderer/index.js');
const {mailAdmin} = require('./lib/Mailer/index.js');
const adminService = require('./services/admin-service/index.js');

const { logger } = require('./lib/Logger/index.js');

const { Pool } = require('pg');
const pool = new Pool();

// log(process.env)

// for (let i = 1; i <= 250; i++) {
//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Error acquiring client', err.stack)
//         }
//
//             // log({ i })
//     const id = `nextval('${conf.db.schema}.clients_id_seq')`;
//     const text = `INSERT INTO ${conf.db.schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
//     // log({ text })
//     const randomName = faker.name.findName(); // Rowan Nikolaus
//     const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
//     const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233
//     const values = [randomName, randomPhoneNumber , randomEmail];
// // // const values = [item[0], item[1], item[2]];
// // //     log({ values })
// //     const res = query(text, values);
//
//         client.query(text, values, (err, result) => {
//             release()
//             if (err) {
//                 return console.error('Error executing query', err.stack)
//             }
//             log({ i })
//             console.log(result.rows)
//         })
//
//         // client.query('SELECT NOW()', (err, result) => {
//         //     release()
//         //     if (err) {
//         //         return console.error('Error executing query', err.stack)
//         //     }
//         //     log({ i })
//         //     console.log(result.rows)
//         // })
//
//         // client.query('SELECT NOW()', (err, result) => {
//         //     release()
//         //     if (err) {
//         //         return console.error('Error executing query', err.stack)
//         //     }
//         //     console.log(result.rows)
//         // })
//     })
// }

// for (let i = 1; i <= 500; i++) {
//     log({ i })
//     const id = `nextval('${conf.db.schema}.clients_id_seq')`;
//     const text = `INSERT INTO ${conf.db.schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
//     // log({ text })
//     const randomName = faker.name.findName(); // Rowan Nikolaus
//     const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
//     const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233
//     const values = [randomName, randomPhoneNumber , randomEmail];
// // const values = [item[0], item[1], item[2]];
// //     log({ values })
//     const res = query(text, values);
//     res
//         .then(data => {
//             // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
//             // client.res.writeHead(200, { 'Connection': 'close' });
//             // client.res.write(text);
//             // client.res.setHeader('Content-Text' + String(index), text);
//             // log({ data })
//         })
//         .catch(err => {
//             // log({ index })
//             // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
//             // client.res.writeHead(500, { 'Connection': 'close' });
//             // client.res.write(err);
//             // client.res.setHeader('Content-Error' + String(index), err);
//             // error = true
//             // log('id ' + String(id))
//             // log({ text })
//             log({ i })
//             log({ values })
//             log({ err })
//             log('--------------------------------------------------------------')
//             // return;
//         })
// }

// const insertClient = async (userName, userRole) => {
//     try {
//
//         try {
//             const client_pg = new Client();
//             await client_pg.connect();
//             const res = await client_pg.query(text, values);
//             resolve(res.rows);
//             await client_pg.end();
//         } catch (e) {
//             reject(e.message);
//         }
//
//         await client.connect();           // gets connection
//         await client.query(
//             `INSERT INTO "users" ("name", "role")
//              VALUES ($1, $2)`, [userName, userRole]); // sends queries
//         return true;
//     } catch (error) {
//         console.error(error.stack);
//         return false;
//     } finally {
//         await client.end();               // closes connection
//     }
// };

// const id = `nextval('${conf.db.schema}.clients_id_seq')`;
// const text = `INSERT INTO ${conf.db.schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
// log({ text })
// const randomName = faker.name.findName(); // Rowan Nikolaus
// const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233
// const values = [randomName, randomPhoneNumber , randomEmail];
// // const values = [item[0], item[1], item[2]];
// log({ values })
// const res = query(text, values);
// res

//     .then(data => {
//         // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
//         // client.res.writeHead(200, { 'Connection': 'close' });
//         // client.res.write(text);
//         // client.res.setHeader('Content-Text' + String(index), text);
//         log({ data })
//     })
//     .catch(err => {
//         // log({ index })
//         // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
//         // client.res.writeHead(500, { 'Connection': 'close' });
//         // client.res.write(err);
//         // client.res.setHeader('Content-Error' + String(index), err);
//         // error = true
//         // log('id ' + String(id))
//         // log({ text })
//         log({ values })
//         log({ err })
//
//         log('--------------------------------------------------------------')
//         // return;
//     })

// const { randomFillSync } = require('crypto');
// // const os = require('os');
// const path = require('path');
// const busboy = require('busboy');
// const { copyFile } = require('fs/promises');

log({ logger })

// log({ os })

// const cache = new Map();
// const routeList = require('./route-list.js');
// cache.set('routeList', routeList);

// log({ cache })


// if (existsSync('/etc/passwd')) {
//     log('The path exists.');
// } else {
//     log('The path NOT exists.');
// }

// const { MIME_TYPES } = require('./const.js');
// const {mail} = require('./services/mail-service.js');

// simplicity and flexibility | SAF platform | flexify
//  SAF - server platform for building applications

// const fs = require("fs"); // Or 'import fs from "fs";' with ESM
// if (fs.existsSync('./const.js')) {
//     // Do something
// }


// const { sys } = require('util');
//
// log({ sys });

// sys.puts(sys.inspect(someVariable));

console.table(memory())

// export const IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i

const Ajv = require('ajv')
const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

// const validate = ((schema, data) => {
//     const validate__ = ajv.compile(schema)
//     const valid = validate__(data)
//
//     if (!valid) {
//         log({ valid })
//         return valid.errors
//         log(valid.errors)
//     } else {
//         log({ valid })
//         return 'data is valid'
//         // log('data is valid')
//     }
// })

const schema = {
    type: 'object',
    properties: {
        foo: {type: 'integer'},
        bar: {type: 'string'}
    },
    required: ['foo', 'bar'],
    additionalProperties: false
}

const data = {
    foo: 1,
    bar: 2
}

// const res = validate(schema, data)
// log({ res })

const validate = ajv.compile(schema)
const valid = validate(data)

if (!valid) {
    log({ valid })
    // return valid.errors
} else {
    log({ valid })
    // return 'data is valid'
    // log('data is valid')
}

log(generateToken());
log(hash());

// http://espressocode.top/http-headers-content-type/
// https://nodejsdev.ru/doc/email/

const CONTENT_TYPES = {
    IMAGE_JPEG: 'image/jpeg',
    IMAGE_PNG: 'image/png',
    MULTIPART_FORMDATA: 'multipart/form-data',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
    APPLICATION_JSON: 'application/json;charset=utf-8'
}

const __404 = (res, info = null) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.statusCode = 404;
    res.end(info);
};

const send = (client => {
    // log({ 'client.data': client.data })
    const data = JSON.stringify(client.data);
    client.res.setHeader('Content-Type', client.mimeType);
    client.res.statusCode = client.statusCode ? statusCode : 200;
    client.res.end(data);
});

const response = send;

class Server {
    constructor() {
        this.route = {};
    }

    response(mimeType, html, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;
        // log({ html })
        res.end(html);
    }

    pipe(mimeType, stream, res, status = 200) {
        res.setHeader('Content-Type', mimeType);
        res.statusCode = status;

        stream.pipe(res);
    }

    createServer(port, host) {
        const server = http.createServer(async (req, res) => {
            // const { method, url, headers } = req;
            const client = new ClientApp(req, res);
            const route = new Route(client);
            const validIndex = httpMethods().indexOf(req.method);

            // log({ validIndex })
            // log(typeof validIndex)

            if (validIndex < 0) {
                res.writeHead(405);
                res.end('Method not allowed');
            } else {
                const hasRoute = route.has();

                // log(client.url)
                // log({ hasRoute })
                // log(client.fileExt)

                if (!hasRoute) {
                    __404(res, '404 - ' + client.url);
                    notify('404 - ' + req.url, 'Страница не найдена');
                } else {
                    if (req.method === 'GET') {
                        const resolve = await route.resolve(client);

                        // log({ resolve })

                        if (resolve !== 'headers_sent') {
                            if ((typeof resolve.stream) === 'string') {
                                this.response(client.mimeType, resolve.stream, res);
                            } else if ((typeof resolve) === 'string') {
                                this.response(client.mimeType, resolve, res);
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
                                }
                            }
                        }

                        // logger.run(req)
                    } else if (req.method === 'PUT') {
                        await route.resolve(client);

                        // try {
                        //     const bb = busboy({ headers: req.headers });
                        //     bb.on('file', (name, file, info) => {
                        //         // console.log({ info })
                        //         const filename = info.filename;
                        //         console.log({ filename })
                        //         res.setHeader('File-Upload', filename);
                        //         try {
                        //             const saveTo = path.join(__APP(), `upload/${filename}`);
                        //             // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                        //             // console.log({ file })
                        //             // file.pipe(process.stdout)
                        //             console.log({ saveTo })
                        //             // console.log(os.tmpdir())
                        //             file.pipe(fs.createWriteStream(saveTo));
                        //         } catch(err) {
                        //             console.log({ err })
                        //         }
                        //     });
                        //     bb.on('field', (name, val, info) => {
                        //         // console.log({ info })
                        //         // console.log(`Field [${name}]: value: %j`, val);
                        //         // params.set(name, val);
                        //         res.setHeader(`Field-${name}`, `${val}`);
                        //     });
                        //     bb.on('close', () => {
                        //         res.setHeader('Info-Status', true);
                        //         res.writeHead(200, { 'Connection': 'close' });
                        //         res.end(`Файл успешно загружен на сервер` );
                        //         // return `That's all folks!!!`;
                        //         // res.writeHead(200, { 'Connection': 'close' });
                        //         // res.end(`That's all folks!!!`);
                        //     });
                        //     req.pipe(bb);
                        //     return;
                        // } catch(err) {
                        //     console.log({ err })
                        //     res.writeHead(500, { 'Connection': 'close' });
                        //     res.end(`${err}`);
                        //     // return {foo:'bar'}
                        // }
                    } else if (req.method === 'POST') {
                        const resolve = await route.resolve(client);

                        // log({ resolve })

                        if (resolve !== 'headers_sent') {
                            const contentType = req.headers['content-type'];
                            if (contentType === undefined) {
                                res.writeHead(400, { 'Connection': 'close' });
                                res.end(`Bad request`);
                            } else {
                                log({ contentType })
                                let body = null;
                                let bodyArr = [];
                                req.on('data', chunk => {
                                    // log({ chunk })
                                    bodyArr.push(chunk)
                                });
                                req.on('end', async function () {
                                    if (contentType === CONTENT_TYPES.FORM_URLENCODED) {
                                        try {
                                            body = bufferConcat(bodyArr); // bufferConcat
                                            // log({ body })
                                            client.body = body;
                                            const { stream } = await route.resolve(client);

                                            // log({ stream })
                                            //
                                            // log(typeof [{foo:'bar'}])

                                            if ((typeof stream) === 'object') {
                                                client.data = stream[0];
                                            } else if ((typeof stream) === 'string') {
                                                client.data = stream;
                                            } else {
                                                client.data = null;
                                            }

                                            // client.data = stream[0];
                                            response(client);
                                            mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
                                        } catch (er) {
                                            // bad json
                                            res.statusCode = 400;
                                            res.end(`error: ${er.message}`);
                                        }
                                    }
                                    if (contentType === CONTENT_TYPES.MULTIPART_FORMDATA) {
                                        try {
                                            // log('vbnbnbnfghrt456gfgfgf')

                                            body = bufferConcat(bodyArr); // bufferConcat
                                            log({ body })
                                            client.body = body;
                                            const { stream } = await route.resolve(client);
                                            client.data = stream[0];

                                            body.forEach(item => {
                                                log({ item })
                                            })

                                            log(typeof body)

                                            // fs.writeFile('/Users/sergionov/Projects/transplant.net/node-server/server/xxx.png', body, function (err) {
                                            //     log('save png')
                                            //
                                            //     if(err)
                                            //         console.log('NNOOOOOOOOOOOO');
                                            // });
                                            // response(client);
                                            // mailAdmin.sendMessage(client.data, 'POST ' + client.url).catch(console.error('mailAdmin.sendMessage'));
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
                                });
                            }
                        } else {
                            res.writeHead(500, { 'Connection': 'close' });
                            res.end(`Request sent
                            
                            `);
                        }
                    }
                }
            }

            log('------------------------------------')
        });

        // server.on('request', function (req, res) {
        //     log('request')
        //     // logger.run(req, res);
        // });

        server.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}/`);
        });
    }

    get(route, handler) {
        this.route['GET'][route] = handler;
    }

    start(port, host) {
        this.createServer(port, host);
    }

    on(fn, par) {
        return fn(...par);
    }

    listen(port, host) {
        return this.createServer(port, host);
    }
}

// log(util.inspect())
// log('END inspect -------------------------')

module.exports = new Server();
