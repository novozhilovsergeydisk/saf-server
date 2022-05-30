'use strict'

const dotenv = require('dotenv')
dotenv.config()

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

// const boundary = 'boundary=----WebKitFormBoundaryjc28wXBdOH4E1Ngm';
//
// const match = boundary.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
//
// //console.log({ 'match': match })

// ******* Common server 1

// const server = require('./server/http-server');
// const HOST_NAME = '127.0.0.1';
// const PORT = 3000;
// server.start(PORT, HOST_NAME);

// ******* END Common server 1

// ******* Common server 2

const http = require('http')
const path = require('path')

const {concatBuffer, bufferConcat, log, dump} = require('./server/helpers.js')
const reportsController = require('./server/controllers/patients/index.js')
const router = require('find-my-way')({
    defaultRoute: (req, res) => {
        res.statusCode = 404
        const render = tmpl.process({}, '404/index.html')
        res.end(render)
        // res.end('404 - PAGE NOT FOUND')
    },
    maxParamLength: 500
})
const {getContent} = require('./server/controllers/main/index.js')
const {tmpl} = require('./server/lib/Renderer/index.js')
const {MIME_TYPES} = require('./constants.js')

function html(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.html)
    res.statusCode = status || 200
    res.end(data.toString())
}

function json(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(JSON.stringify(data))
}

function send(res, data, mimeType, status) {
    res.setHeader('Content-Type', mimeType || MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(data.toString())
}

function getMimeType(req, mimeType) {
    const fileExt = path.extname(req.url).substring(1)
    mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
    return mimeType
}

function pipe(req, res, stream, mimeType) {
    mimeType = getMimeType(req, mimeType)
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 200
    stream.pipe(res)
}

function error(res, status, mimeType, err) {
    res.setHeader('Content-Type', mimeType || MIME_TYPES.html)
    res.statusCode = status || 404;
    res.end(err || 'UNKNOWN ERROR')
}

function error404(res) {
    res.setHeader('Content-Type', MIME_TYPES.html);
    res.statusCode = 404;
    res.end('404 - PAGE NOT FOUND')
}

function error405(res) {
    res.setHeader('Content-Type', MIME_TYPES.html)
    res.statusCode = 405;
    res.end('405 - RESOURCE NOT FOUND')
}

function error500(res) {
    res.setHeader('Content-Type', MIME_TYPES.html)
    res.statusCode = 500;
    res.end('500 - SERVER ERROR')
}

function resolveresource(req, res, mimeType) {
    getContent(req.url).then(stream => {
        (stream === null) ? error404(res) : pipe(req, res, stream, mimeType)
    }).catch(err => {
        log({err})
    })
}

function staticRoutes(router) {
    router.on('GET', '/css/*', (req, res) => {
        resolveresource(req, res)
    })

    router.on('GET', '/fonts/*', (req, res) => {
        resolveresource(req, res)
    })

    router.on('GET', '/webfonts/*', (req, res) => {
        resolveresource(req, res)
    })

    router.on('GET', '/img/*', (req, res) => {
        resolveresource(req, res)
    })

    router.on('GET', '/js/*', (req, res) => {
        resolveresource(req, res)
    })

    router.on('GET', '/robots/robots.txt', (req, res) => {
        resolveresource(req, res, MIME_TYPES.textPlain)
    })

    router.on('GET', '/favicon.ico', (req, res) => {
        resolveresource(req, res)
    })

    // log('staticRoutes')
}

function getRoutes(router) {
    router.on('GET', '/reports/annual', (req, res) => {
        // log({ res })
        // const render = tmpl.process({ data: {} }, 'forms/user/index.html')
        // log({ render })
        html(res, 'reports/annual')
    })

    router.on('GET', '/reports/monthly/:year/:month', (req, res, params) => {
        log({ params })
        const data = reportsController.monthlyReports(2022, 5)

        // Object.keys(key => {
        //     log({ key })
        // })

        // log({ data })
        const render = tmpl.process({ data: data }, 'reports/monthly/index.html')
        // log({ render })
        html(res, render)
    })

    router.on('GET', '/patients/total', (req, res) => {
        // log({ res })
        // const render = tmpl.process({ data: {} }, 'forms/user/index.html')
        // log({ render })
        json(res, '/patients/total')
    })

    router.on('GET', '/patients/active', (req, res) => {
        send(res, {'patients-active': '/patients/active'})
    })

    router.on('GET', '/', (req, res) => {
        res.end('{"message":"transplant.net"}')
    })

    const store = {foo: 'bar'}
    router.on('GET', '/reports', ['foo', 'bar'], (req, res) => {
        res.end('{"message":"reports"}')
    }, store)

    router.on('GET', '/clinics', (req, res, params) => {
        res.end('{"message":"clinics"}')
    })

    // router.on('GET', '/form/user', (req, res) => {
    //     // log({ res })
    //     const render = tmpl.process({ data: {} }, 'forms/user/index.html')
    //     // log({ render })
    //     res.end(render)
    // })
}

function postRoutes(router) {
    router.on('POST', '/form/user/add', (req, res) => {
        const data = 'test' // {name: 'postRoutes'}
        // log({ data })
        send(res, data)
    })

    router.on('POST', '/patients/total', (req, res) => {
        const data = '/patients/total' // {name: 'postRoutes'}
        // log({ data })
        send(res, data)
    })
}

postRoutes(router)

getRoutes(router)

staticRoutes(router)

function Handler() {
    if (!(this instanceof Handler)) {
        return new Handler()
    }
}

Handler.prototype.patients = function patients(req, res) {
    res.end('patients')
}

Handler.prototype.doctors = function doctors(req, res) {
    res.end('doctors')
}

Handler.prototype.getFormData = function (req, res) {
    let body = null;
    let bodyArr = [];
    req.on('data', chunk => {
        // log({ chunk })
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        // log({ chunk })
        body = Buffer.concat(bodyArr).toString() // bufferConcat(bodyArr) // bufferConcat
        // log({ bodyArr })
        // log({ body })
        // return body
        json(res, body)
        // res.end('/form/data/*')
    })
    // log({ data })
    // dump(data._events.end)
    // res.end('/form/data')
}

const handler = new Handler()

// log(typeof handler.patients)
router.on('GET', '/patients/', handler.patients)
router.on('GET', '/doctors/', handler.doctors)
router.on('GET', '/form/user', (req, res) => {
    const render = tmpl.process({ data: {} }, 'forms/user/index.html')
    html(res, render)
})

router.on('POST', '/form/data', (req, res) => {
    handler.getFormData(req, res)
})

// dump(router.routes)

const server = http.createServer((req, res) => {
    router.lookup(req, res)
})

server.listen(3000, err => {
    if (err) throw err
    console.log('Server listening on: http://localhost:3000')
})

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
