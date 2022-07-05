'use strict'

import * as path from 'path';
// console.log({ path });
import * as fs from 'fs';
// console.log({ fs });
import * as Pool from 'pg';
// console.log({ Pool });
import * as router from 'find-my-way';

// router({
//     defaultRoute: (req, res) => {
//         // app.plain(res, '404 - Not found', 404)
//         res.statusCode = 404
//         // const render = tmpl.process({}, '404/index.html')
//         res.end('404 not found')
//     },
//     maxParamLength: 500
// });

// console.log({ router });
import * as MIME_TYPES from './constants.js'
// console.log({ MIME_TYPES });

// const {MIME_TYPES} = require('../constants.js')
// // const {getContent} = require('../server/controllers/main/index.js')
// const {statPath, __STATIC, removeLastSymbol} = require('../server/helpers.js')

export class App {
    private router: any;

    public constructor (router: any) {
        this.router = router
    }

    public route(): any {
        return this.router;
    }

    public query = async function (sql) {
        let response
        try {
            const pool = new Pool()
            const result = pool.query(sql)
            return result.then(data => {
                pool.end()
                const rows = data.rows
                response = { status: 'success', data: rows }
                return response
            }).catch(error => {
                response = { status: 'failed', error: { message: 'Ошибка запроса к серверу БД', info: error } }
                console.log(error)
                return response
            })
        } catch(error) {
            response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: error } }
            console.log(error)
            return response
        }
    }
}

// const app = new App(router);
//
// console.log({ app })

// export as namespace app__;



// console.log({ app }); // person.name isn't accessible from outside the class since it's private

// App.prototype.router = router;

// App.prototype.query = async function (sql) {
//     let response
//     try {
//         const pool = new Pool()
//         const result = pool.query(sql)
//         return result.then(data => {
//             pool.end()
//             const rows = data.rows
//             response = { status: 'success', data: rows }
//             return response
//         }).catch(error => {
//             response = { status: 'failed', error: { message: 'Ошибка запроса к серверу БД', info: error } }
//             console.log(error)
//             return response
//         })
//     } catch(error) {
//         response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: error } }
//         log(error)
//         return response
//     }
// }

// App.prototype.html = function (res, data, status) {
//     res.setHeader('Content-Type', MIME_TYPES.html)
//     res.statusCode = status || 200
//     res.end(data.toString())
// }
//
// App.prototype.json = function (res, data, status) {
//     res.setHeader('Content-Type', MIME_TYPES.json)
//     res.statusCode = status || 200
//     res.end(JSON.stringify(data))
// }
//
// App.prototype.plain = function (res, data, status) {
//     // res.setHeader('Content-Type', MIME_TYPES.plain)
//     res.statusCode = status || 200
//     res.end(data.toString())
// }
// App.prototype.send = function (res, data, mimeType, status) {
//     res.setHeader('Content-Type', mimeType || MIME_TYPES.json)
//     res.statusCode = status || 200
//     res.end(data.toString())
// }
//
// App.prototype.getMimeType = function (req, mimeType) {
//     const fileExt = path.extname(req.url).substring(1)
//     mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
//     return mimeType
// }
//
// App.prototype.pipe = function (req, res, stream, mimeType) {
//     const fileExt = path.extname(req.url).substring(1)
//     mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
//     res.setHeader('Content-Type', mimeType)
//     res.statusCode = 200
//     stream.pipe(res)
// }
//
// App.prototype.error = function (res, status, mimeType, err) {
//     res.setHeader('Content-Type', mimeType || MIME_TYPES.json)
//     res.statusCode = status || 404
//     res.end(err || 'UNKNOWN ERROR')
// }
//
// App.prototype.error404 = function (res, err) {
//     res.setHeader('Content-Type', 'text/plain')
//     res.statusCode = 404
//     res.end(err || '404 - Not Found')
// }
//
// App.prototype.error405 = function (res, err) {
//     res.setHeader('Content-Type', MIME_TYPES.plain)
//     res.statusCode = 405
//     res.end(err || '405 - Method Not Allowed')
// }
//
// App.prototype.error500 = function (res, err) {
//     res.setHeader('Content-Type', MIME_TYPES.plain)
//     res.statusCode = 500
//     res.end(err || '500 - Internal Server Error')
// }
//
// App.prototype.error520 = function (res, err) {
//     res.setHeader('Content-Type', MIME_TYPES.plain)
//     res.statusCode = 520
//     res.end(err || '520 - Unknown Error')
// }
//
// App.prototype.resolveresource = function (req, res) {
//     const url = removeLastSymbol('/', req.url)
//     const stats = statPath(__STATIC(req.url))
//
//     // console.log({ res })
//
//     if (!stats) {
//         res.setHeader('Content-type', 'text/plain')
//         res.statusCode = 404
//         res.end('404 - Not found')
//     } else {
//         const stream = fs.createReadStream(__STATIC(url))
//
//         if (stream !== null) {
//             const mimeType = this.getMimeType(req)
//             this.pipe(req, res, stream, mimeType)
//         } else {
//             this.error404(req, res)
//         }
//     }
//
//     // if(stats && stats.isFile()) {
//     //     log('is file')
//     //     data = await fs.createReadStream(__STATIC(url));
//     // }
// }
//
// const isObject = (data => {
//     return ((typeof data) === 'object') ? true : false
// })
//
// const isString = (data => {
//     return ((typeof url) === 'string') ? true : false
// })
//
// const _static = ((urls, router) => {
//     if (isObject(urls)) {
//         urls.forEach(url => {
//             router.on('GET', url, (req, res) => {
//                 app.resolveresource(req, res)
//             })
//         })
//     }
//
//     if (isString(urls)) {
//         const url = urls
//         router.on('GET', url, (req, res) => {
//             app.resolveresource(req, res)
//         })
//     }
// })
//
// const app = new App()
// module.exports = {app, _static}

