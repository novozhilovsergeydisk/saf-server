'use strict';

console.log('script start');

const testData = {stack: 'overflow'};

// Pattern singleton
// const singleton = {foo: 'bar'}; // (instance => () => instance)({foo: 'bar'})
// console.assert(singleton === singleton);
// console.log('instances are equal');
// End - Pattern singleton

// const buf = Buffer.from([1, 2, 3, 4]);
// const uint32array = new Uint32Array(buf);
// console.log({ uint32array });

// const singleton = (instance => () => instance)({foo: 'bar'})
//
// console.log({ singleton })
// console.log({ 'singleton()': singleton({mini: 'go'}) })
//
// console.assert(singleton() === singleton())
// console.log('instances are equal')

const dotenv = require('dotenv');
dotenv.config();

// console.log(process.env);

/*
  Char codes:
    '!': 33 - !
    '#': 35 - %23
    '$': 36 - %24
    '%': 37 - %25
    '&': 38 - %26
    ''': 39 - '
    '(': 40 - (
    ')': 41 - )
    '*': 42 - *
    '+': 43 - %2B
    ',': 44 - %2C
    '-': 45 - -
    '.': 46 - .
    '/': 47 - %2F
    ':': 58 - %3A
    ';': 59 - %3B
    '=': 61 - %3D
    '?': 63 - %3F
    '@': 64 - %40
    '_': 95 - _
    '~': 126 - ~
*/

// ******* Common server 1

// const server = require('./server/http-server');
// const HOST_NAME = '127.0.0.1';
// const PORT = 3000;
// server.start(PORT, HOST_NAME);

// ******* END Common server 1

// ******* Common server 2

const http = require('http');
// const path = require('path')
// const {app__} = require('./app.js');
const {app, __static__} = require('./src/app.js');
const {hash, generateToken, log} = require('./server/helpers.js');
const reportsController = require('./server/controllers/patients/index.js');
const {tmpl} = require('./server/lib/Renderer/index.js');
const {MIME_TYPES} = require('./constants.js');
const {handler} = require('./src/handler.js');

// Controllers
const client = require('./server/controllers/client/index.js');

const { Pool } = require('pg');
const Ajv = require('ajv').default
const ajv = new Ajv({ allErrors: true })
require('ajv-errors')(ajv /*, {singleError: true} */)

// functions

function __resolve__(req, res, fn) {
    let bodyArr = [], parsingData = null;
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        // log({ bodyArr })
        const body = Buffer.concat(bodyArr).toString()
        try {
            parsingData = JSON.parse(body);
        } catch (err) {
            parsingData = { status: 'failed', error: { message: 'Ошибка при обработке данных', detail: err } };
        }
        // log({ body })
        // log({ parsingData })

        // log({ parsingData })

        fn(req, res, parsingData);
        // fn(res, bodyArr)
    })
}

function json(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json);
    res.statusCode = status || 200;
    res.end(JSON.stringify(data));
};

function html(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.html);
    res.statusCode = status || 200;
    res.end(data.toString());
};

function textPlain(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.plain);
    res.statusCode = status || 200;
    res.end(data.toString());
};

function isFunction(fn) {
    return ((typeof fn) === 'function')
}

async function resolve(fn, ...arg) {
    let response;
    try {
        const args = Array.prototype.slice.call(arguments);
        if (args.length < 2) {
            response = { status: 'failed', error: { message: 'Неверное число аргументов, должно быть минимум два параметра' } };
        } else {
            response = isFunction(fn) ? { status: 'success', data: await fn(...arg) } : { status: 'failed', error: { message: 'Первый параметр не является функцией' } };
            log({ response });
        }
        log({ 'args.length': args.length });
        // log({ args });
        log({ response });
        return response;
    } catch (err) {
        response = { status: 'failed', error: { message: 'Ошибка при вызове функции', info: err } };
        log({ response });
        return response;
    }
}

async function query (sql, params = null) {
    let response;
    try {
        const pool = new Pool();
        const result = pool.query(sql, params);
        return result.then(data => {
            pool.end();
            const rows = data.rows;
            response = { status: 'success', data: rows };
            return response;
        }).catch(error => {
            response = { status: 'failed', error: { message: 'Ошибка запроса к серверу БД', info: error } };
            console.log(error);
            return response;
        })
    } catch(error) {
        response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: error } };
        log(error);
        return response;
    }
}

// handlers

function HandlerPost() {
    if (!(this instanceof HandlerPost)) {
        return new HandlerPost()
    }
}

HandlerPost.prototype.clientAdd = function (res, data) {
    // json(res, { data: data });
    //
    // return;

    // let validate, validation;

    let response;

    const schema = {
        type: 'object',
        required: ['fio', 'phone', 'email'],
        allOf: [
            {
                properties: {
                    fio: { type: "string", minLength: 2 },
                    phone: { type: "string", minLength: 8 },
                    email: { type: "string", minLength: 6 },
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                fio: 'Минимум 2 символа',
                phone: 'Минимум 8 символов',
                email: 'Минимум 6 символов',
            },
        },
    }

    try {
        const validate = ajv.compile(schema);
        const validation = validate(data);
        // log({ validation })

        if (validation) {
            response = data;
        } else {
            response = { status: 'failed', error: { message: 'Ошибка при валидации данных' } };
        }
        json(res, { response });
    } catch (err) {
        response = { status: 'failed', error: { message: 'Ошибка при обработке данных' } };
        json(res, { response });
    }

    // json(res, { response });
}

const handlerPost = new HandlerPost();

// routes

const router = app.router;

router.on('GET', '/account/select', async (req, res) => {
    const sql = `SELECT * FROM account`;
    const result = await app.query(sql);
    json(res, result.data);
});

router.on('GET', '/records/select', async (req, res) => {
    const sql = `SELECT * FROM crm.records`;
    const result = await app.query(sql);
    app.json(res, result.data);
});

const staticRoutes = [
    '/css/*',
    '/fonts/*',
    '/iwebfonts/*',
    '/img/*',
    '/js/*',
    '/robots/robots.txt',
    '/favicon.ico',
    '/images/*',
    '/vendors/*',
    '/js-admin/*',
    '/nephrocenter/*'
];

function use(url, data = {}) {
    log({ url })

    router.on('GET', url, (req, res) => {
        const template = 'nephrocenter' + url + '/index.html';
        const render = tmpl.process(data, template);

        // log({ render });

        html(res, render);
    });
}

function route(url, data = {}) {
    log({ url })

    router.on('GET', url, (req, res) => {
        const template = 'nephrocenter' + url + '/index.html';
        const render = tmpl.process(data, template);

        // log({ render });

        html(res, render);
    });
}

__static__(staticRoutes, router);

function telerehabRoutes(router) {
    router.on('GET', '/telerehab/main', (req, res) => {
        const template = 'telerehab/main/index.html';
        const render = tmpl.process({}, template);
        html(res, render);
    });

    router.on('GET', '/telerehab/organizations', (req, res) => {
        const template = 'telerehab/organizations/index.html';
        const render = tmpl.process({}, template);
        html(res, render);
    });
}

function nephrocenterRoutes(router) {
    route('/pat/prevention');

    route('/pat/prevention/kidneys-functions');
    route('/pat/prevention/symptoms-kidney-disease');
    route('/pat/prevention/diagnosis-kidney-disease', {title: 'Диагностика болезней почек'});

    route('/pat/prevention/facts-kidney-disease');
    route('/pat/prevention/prevention-kidney-disease');
    route('/pat/prevention/kidneys-pregnancy');
    route('/pat/prevention/patient-library');

    // router.on('GET', '/pat/prevention/kidneys-functions', (req, res) => {
    //     const template = 'nephrocenter/pat/prevention/kidneys-functions/index.html';
    //     const render = tmpl.process({}, template);
    //     html(res, render);
    // });
    //
    // router.on('GET', '/pat/prevention/symptoms-kidney-disease', (req, res) => {
    //     const template = 'nephrocenter/pat/prevention/symptoms-kidney-disease/index.html';
    //     const render = tmpl.process({}, template);
    //     html(res, render);
    // });

    // router.on('GET', '/pat/prevention/diagnosis-kidney-disease', (req, res) => {
    //     const template = 'nephrocenter/pat/prevention/diagnosis-kidney-disease/index.html';
    //     log({ template })
    //     const render = tmpl.process({}, template);
    //     html(res, render);
    // });

    router.on('GET', '/pat/tpl/prevention/detail__', (req, res) => {
        const template = 'nephrocenter/prevention-detail/index.html';
        const render = tmpl.process({}, template);
        html(res, render);
    });

    router.on('GET', '/pat/tpl/patient__', (req, res) => {
        const template = 'nephrocenter/patient/index.html';
        const render = tmpl.process({}, template);
        html(res, render);

        // textPlain(res, 'nephrocenter/patient')
    });
}

function patientRoutes(router) {
    router.on('GET', '/reports/annual', (req, res) => {
        textPlain(res, 'reports/annual');
    })

    router.on('GET', '/reports/monthly/:year/:month', async (req, res, params) => {
        log({params});
        const data = await reportsController.monthlyReports(params.year, params.month);

        // log({ data })
        //
        // const render = tmpl.process({data: data}, 'reports/monthly/index.html')

        textPlain(res, data);
    });

    router.on('GET', '/patients/total', (req, res) => {
        json(res, '/patients/total');
    });

    router.on('GET', '/patients/active', (req, res) => {
        res.send(res, JSON.stringify({data: '/patients/active'}));
    });

    router.on('GET', '/', (req, res) => {
        res.setHeader('Content-Type', MIME_TYPES.plain);
        res.end("{message: / }");
    });

    // crm

    router.on('GET', '/recordspay/select', async (req, res) => {
        const sql = `SELECT * FROM crm.recordspay`;
        const result = await app.query(sql);
        log({ result });
        res.end('/recordspay/select');
    })

    // const appRouter = router;
    //
    // log({ appRouter })
    //
    // log({ router })

    // router.on('GET', '/crm/records/select', async (req, res) => {
    //     // const pool = new Pool()
    //     const sql = `SELECT * FROM crm.records`
    //
    //     const result = await app.query(sql)
    //
    //     log({ result })
    //     log( result.data)
    //     log('------------')
    //
    //     app.plain(res, '/crm/clients/select')
    //
    //     // app.plain(res,'/crm/records/select')
    //
    //     // result.then(data => {
    //     //     // pool.end()
    //     //
    //     //     const result = data.data;
    //     //
    //     //     log({ result })
    //     //
    //     //     const response = {status: 'success', data: result, error: null}
    //     //     log({ response })
    //     //     app.json(res, response)
    //     // }).catch(err => {
    //     //     const responseError = {status: 'failed', data: null, error: {message: 'Ошибка сервера БД', info: err}}
    //     //     log({ err })
    //     //     app.json(res, responseError)
    //     // })
    // })

    router.on('GET', '/crm/services/select', async (req, res) => {
        const sql = `SELECT * FROM crm.services;`
        const result = await handler.query(sql);
        log({ 'result.data': result.data });
        res.end('crm/clients/select');
    })

    router.on('GET', '/crm/clients/select', async (req, res) => {
        const result = await handler.getClients();
        log({ 'result.data': result.data });
        res.end('crm/clients/select');
    })

    router.on('GET', '/ui', async (req, res) => {
        let result, sql;

        sql = `SELECT * FROM crm.clients`;
        result = await handler.query(sql);
        const clients = result.data;

        sql = `SELECT * FROM crm.services;`
        result = await handler.query(sql);
        const services = result.data;

        sql = `
            SELECT r.id, r.__date__, c.name client_name, s.name service_name FROM crm.records r 
            JOIN crm.clients c on c.id = r.client_id
            JOIN crm.services s on s.id = r.service_id
        `;
        result = await handler.query(sql);
        const records = result.data;

        sql = `
            SELECT rp.id, rp.__date__, rp.__sum__, c.name client_name, s.name service_name FROM crm.recordspay rp 
            JOIN crm.records r on r.id = rp.record_id
            JOIN crm.clients c on c.id = r.client_id
            JOIN crm.services s on s.id = r.service_id
        `;

        result = await handler.query(sql);
        const recordspay = result.data;
        const index = 'crm/ui/index.html';
        const render = tmpl.process({ data: {clients: clients, services: services, records: records, recordspay: recordspay} }, index)
        app.html(res, render)
    })

    // End crm

    const store = {foo: 'bar'}
    router.on('GET', '/reports', ['foo', 'bar'], (req, res) => {
        res.end('{"message":"reports"}')
    }, store)

    router.on('GET', '/clinics', (req, res, params) => {
        res.end('{"message":"clinics"}')
    })

    router.on('GET', '/room/:id', (req, res, params) => {
        // log(generateToken())
        // log(hash())
        log({params});
        const roomId = generateToken();
        const template = 'chat/index.html';
        const render = tmpl.process({roomId: roomId}, template);
        html(res, render);
    })

    router.on('GET', '/test', (req, res) => {
        const render = 'test';
        res.end(render);
    });
}

function crmRoutes(router) {
    // GET

    router.on('GET', '/admin', async (req, res) => {
        let result, sql;

        sql = `SELECT * FROM crm.clients`;
        result = await app.query(sql);
        const clients = result.data;

        sql = `SELECT * FROM crm.services`;
        result = await handler.query(sql);
        const services = result.data;

        sql = `
            SELECT r.id, r.__date__, c.name client_name, s.name service_name FROM crm.records r 
            JOIN crm.clients c on c.id = r.client_id
            JOIN crm.services s on s.id = r.service_id
        `;
        result = await handler.query(sql);
        const records = result.data;

        sql = `
            SELECT rp.id, rp.__date__, rp.__sum__, c.name client_name, s.name service_name FROM crm.recordspay rp 
            JOIN crm.records r on r.id = rp.record_id
            JOIN crm.clients c on c.id = r.client_id
            JOIN crm.services s on s.id = r.service_id
        `;

        result = await handler.query(sql);
        const recordspay = result.data;
        const index = 'admin/index.html';
        const render = tmpl.process({ data: {clients: clients, services: services, records: records, recordspay: recordspay} }, index);

        // app.plain(res, 'admin')

        res.setHeader('Content-Type', MIME_TYPES.html);
        res.statusCode = 200;
        res.end(render.toString());

        // app.html(res, render)
    });

    router.on('GET', '/admin/clients', async (req, res) => {
        let result, sql;

        sql = `SELECT * FROM crm.clients`;
        result = await query(sql);
        const clients = result.data;

        log({ clients });

        const http_address = process.env.HTTP_ADDRESS;
        const index = 'admin/clients/index.html';
        const data = { data: { http_address: http_address, clients: clients } };

        log({ 'http_address': http_address });

        const render = tmpl.process(data, index);

        html(res, render);
    });

    router.on('GET', '/admin/services', async (req, res) => {
        let result, sql;

        sql = `SELECT * FROM crm.services`;
        result = await query(sql);
        const services = result.data;

        log({ services });

        const http_address = process.env.HTTP_ADDRESS;
        const index = 'admin/services/index.html';
        const data = { data: { http_address: http_address, services: services } };

        log({ 'http_address': http_address });

        const render = tmpl.process(data, index);

        html(res, render);
    });

    // POST

    router.on('POST', '/admin/services/add', (req, res) => {
        log('crm/services/insert')
        handler.store(req, res, handler.serviceInsert)
    })

    router.on('POST', '/admin/client/add', (req, res) => {
        console.log('/admin/client/add');

        const result = __resolve__(req, res, client.clientAdd);

        // store(req, res, client.clientAdd);
        // resolve(client.clientAdd, req, res);
    });
}

crmRoutes(router);
patientRoutes(router);
nephrocenterRoutes(router);
telerehabRoutes(router);

//

handler.get(router);
handler.post(router);

//

const server = http.createServer((req, res) => {
    router.lookup(req, res);
});
const port = process.env.HTTP_PORT;
server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on: http://localhost: ${port}`);
});

// ******* END Common server 2


// const { randomFillSync } = require('crypto');
// const fs = require('fs');
// const http = require('http');
// // const os = require('os');
// const path = require('path');
// const {log} = require('./server/helpers.js');
// const busboy = require('busboy');
// const { copyFile } = require('fs/promises');
// const random = (() => {
//     const buf = Buffer.alloc(16);
//     return () => randomFillSync(buf).toString('hex');
// })();
//
// const cpFile = ((source, dest) => {
//     try {
//         return copyFile(source, dest);
//         console.log('source.txt was copied to destination.txt');
//     } catch {
//         console.log('The file could not be copied');
//     }
// });
// function logMapElements(value, key, map) {
//     console.log(`m[${key}] = ${value}`);
// }
//
// new Map([['foo', 3], ['bar', {}], ['baz', undefined]])
//     .forEach(logMapElements);
// expected output: "m[foo] = 3"
// expected output: "m[bar] = [object Object]"
// expected output: "m[baz] = undefined"


// ******* Upload server

// const { randomFillSync } = require('crypto');
// const fs = require('fs');
// const http = require('http');
// const os = require('os');
// const path = require('path');
//
// const busboy = require('busboy');

// const random = (() => {
//     const buf = Buffer.alloc(16);
//     return () => randomFillSync(buf).toString('hex');
// })();
// const params = new Map();

// http.createServer((req, res) => {
//     if (req.method === 'PUT') {
//         try {
//             const bb = busboy({ headers: req.headers });
//             bb.on('file', (name, file, info) => {
//                 // console.log({ info })
//                 const filename = info.filename;
//                 console.log({ filename })
//                 res.setHeader('File-Upload', filename);
//                 const saveTo = path.join(__dirname, `upload/${filename}`);
//                 // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
//                 // console.log({ file })
//                 // file.pipe(process.stdout)
//                 // console.log({ saveTo })
//                 // console.log(os.tmpdir())
//                 file.pipe(fs.createWriteStream(saveTo));
//             });
//             bb.on('field', (name, val, info) => {
//                 console.log({ info })
//                 console.log(`Field [${name}]: value: %j`, val);
//                 // params.set(name, val);
//                 res.setHeader(`Field-${name}`, `${val}`);
//             });
//             bb.on('close', () => {
//                 res.setHeader('Info-Status', true);
//                 res.writeHead(200, { 'Connection': 'close' });
//                 res.end(`Файл успешно загружен на сервер` );
//                 // return `That's all folks!!!`;
//                 // res.writeHead(200, { 'Connection': 'close' });
//                 // res.end(`That's all folks!!!`);
//             });
//             req.pipe(bb);
//             return;
//         } catch(err) {
//             console.log({ err })
//             res.writeHead(500, { 'Connection': 'close' });
//             res.end(`${err}`);
//             // return {foo:'bar'}
//         }
//     } else if (req.method === 'GET') {
//         res.writeHead(200, { Connection: 'close' });
//         res.end(`
//       <html>
//         <head></head>
//         <body style__="background: darkslategray /*#1594b7*/">
//           <body>
//           <form method="POST" enctype="multipart/form-data">
//             <input type="file" name="filefield"><br />
//             <input id="test1" type="text" name="test1" value=""><br />
//             <input id="test2" type="text" name="test2" value=""><br />
//             <input id="btn-uploadfile" type="button" value="Upload">
//           </form>
//         </body>
//
//           <script>
//             logMapElements = ((value, key, map) => {
//                 console.log(map[key] + ' =  ' + value);
//             })
//
//             const btnUpload = document.getElementById('btn-uploadfile');
//             btnUpload.addEventListener('click', (event) => {
//                 const formData = new FormData();
//                 const fileField = document.querySelector('input[type="file"]');
//                 const test1 = document.getElementById('test1');
//                 const test2 = document.getElementById('test2');
//                 // console.log({ 'test.value': test.value });
//                 formData.append('test1', test1.value);
//                 formData.append('test2', test2.value);
//                 formData.append('avatar', fileField.files[0]);
//
//                 fetch('/upload', {
//                     method: 'PUT',
//                     body: formData
//                 })
//                 .then(response => {
//                     console.log('response:', response.status);
//                     console.log('headers:', response.headers.get('Info-Params'));
//                     const par = response.headers.get('Field-test1');
//                     console.log({ par })
//                     // const test1 = response.headers.get('Info-Params')['test1'];
//                     // console.log(Object.keys(par))
//                     // mapEls.forEach(logMapElements);
//
//                     console.log('ok:', response.ok);
//                     return response
//                 })
//                 .then(result => {
//                     console.log(Object.keys(result));
//                     console.log('Success:', result);
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             });
//           </script>
//         </body>
//       </html>
//     `);
//     } else {
//         res.writeHead(405);
//         res.end();
//     }
//     res.writeHead(404);
//     res.end();
// }).listen(3000, () => {
//     console.log('Listening for requests ');
// });

// ******* END Upload server
