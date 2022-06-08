'use strict'

const path = require('path')
const fs = require('fs')

const {MIME_TYPES} = require('../constants.js')
// const {getContent} = require('../server/controllers/main/index.js')
const {statPath, __STATIC, removeLastSymbol} = require('../server/helpers.js')

function App() {

}

App.prototype.html = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.html)
    res.statusCode = status || 200
    res.end(data.toString())
}
App.prototype.json = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(JSON.stringify(data))
}
App.prototype.plain = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.plain)
    res.statusCode = status || 200
    res.end(data.toString())
}
App.prototype.send = function (res, data, mimeType, status) {
    res.setHeader('Content-Type', mimeType || MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(data.toString())
}
App.prototype.getMimeType = function (req, mimeType) {
    const fileExt = path.extname(req.url).substring(1)
    mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
    return mimeType
}
App.prototype.pipe = function (req, res, stream, mimeType) {
    const fileExt = path.extname(req.url).substring(1)
    mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 200
    stream.pipe(res)
}
App.prototype.error = function (req, res, status, mimeType, err) {
    res.setHeader('Content-Type', mimeType || MIME_TYPES.plain)
    res.statusCode = status || 404
    res.end(err || 'UNKNOWN ERROR')
}
App.prototype.error404 = function (req, res, err) {
    res.setHeader('Content-Type', 'text/plain')
    res.statusCode = 404
    res.end(err || '404 - Not Found')
}
App.prototype.error405 = function (req, res, err) {
    res.setHeader('Content-Type', MIME_TYPES.plain)
    res.statusCode = 405
    res.end(err || '405 - Method Not Allowed')
}
App.prototype.error500 = function (req, res, err) {
    res.setHeader('Content-Type', MIME_TYPES.plain)
    res.statusCode = 500
    res.end(err || '500 - Internal Server Error')
}
App.prototype.resolveresource = function (req, res) {
    const url = removeLastSymbol('/', req.url)
    const stats = statPath(__STATIC(req.url))

    if (!stats) {
        // log({ url })
        // log({ stats })
        // log('----------------------')
        this.error404(req, res)
    } else {
        const stream = fs.createReadStream(__STATIC(url))

        if (stream !== null) {
            const mimeType = this.getMimeType(req)
            this.pipe(req, res, stream, mimeType)
        } else {
            this.error404(req, res)
        }

        // log({ stream })

        // res.setHeader('Content-Type', MIME_TYPES.html)
        // res.statusCode = 200
        // res.end('App.prototype.resolveresource')
    }

    // try {
    //     const isFile = stats.isFile()
    //     log({ url })
    //     log({ isFile })
    //     log('-----------------------')
    // } catch(err) {
    //     log({ err })
    //     log('-----------------------')
    // }

    // if(stats && stats.isFile()) {
    //     log('is file')
    //     data = await fs.createReadStream(__STATIC(url));
    // }

    // res.setHeader('Content-Type', MIME_TYPES.html)
    // res.statusCode = 200
    // res.end('App.prototype.resolveresource')

    // console.log({ res })

    // getContent(req.url).then(stream => {
    //     log({ stream })
    //     console.log({ res })
    //     if (stream !== null) {
    //         const mimeType = this.getMimeType(req)
    //         this.pipe(req, res, stream, mimeType)
    //     } else {
    //         this.error405(res)
    //     }
    // }).catch(err => {
    //     this.error500(res, err)
    //
    //     this.console.log({ err })
    // })
}

const isObject = (data => {
    return ((typeof data) === 'object') ? true : false
})

const isString = (data => {
    return ((typeof url) === 'string') ? true : false
})

const _static = ((urls, router) => {
    if (isObject(urls)) {
        urls.forEach(url => {
            router.on('GET', url, (req, res) => {
                app.resolveresource(req, res)
            })
        })
    }

    if (isString(urls)) {
        const url = urls
        router.on('GET', url, (req, res) => {
            app.resolveresource(req, res)
        })
    }
})

const app = new App()
module.exports = {app, _static}


// 1xx: Informational (информационные):
// 100 Continue («продолжай»)[2][3];
// 101 Switching Protocols («переключение протоколов»)[2][3];
// 102 Processing («идёт обработка»);
// 103 Early Hints («ранняя метаинформация»);
// 2xx: Success (успешно):
// 200 OK («хорошо»)[2][3];
// 201 Created («создано»)[2][3][4];
// 202 Accepted («принято»)[2][3];
// 203 Non-Authoritative Information («информация не авторитетна»)[2][3];
// 204 No Content («нет содержимого»)[2][3];
// 205 Reset Content («сбросить содержимое»)[2][3];
// 206 Partial Content («частичное содержимое»)[2][3];
// 207 Multi-Status («многостатусный»)[5];
// 208 Already Reported («уже сообщалось»)[6];
// 226 IM Used («использовано IM»).
// 3xx: Redirection (перенаправление):
// 300 Multiple Choices («множество выборов»)[2][7];
// 301 Moved Permanently («перемещено навсегда»)[2][7];
// 302 Moved Temporarily («перемещено временно»)[2][7], 302 Found («найдено»)[7];;
// 303 See Other («смотреть другое»)[2][7];
// 304 Not Modified («не изменялось»)[2][7];
// 305 Use Proxy («использовать прокси»)[2][7];
// 306 — зарезервировано (код использовался только в ранних спецификациях)[7];
// 307 Temporary Redirect («временное перенаправление»)[7];
// 308 Permanent Redirect («постоянное перенаправление»)[8].
// 4xx: Client Error (ошибка клиента):
// 400 Bad Request («неправильный, некорректный запрос»)[2][3][4];
// 401 Unauthorized («не авторизован (не представился)»)[2][3];
// 402 Payment Required («необходима оплата»)[2][3];
// 403 Forbidden («запрещено (не уполномочен)»)[2][3];
// 404 Not Found («не найдено»)[2][3];
// 405 Method Not Allowed («метод не поддерживается»)[2][3];
// 406 Not Acceptable («неприемлемо»)[2][3];
// 407 Proxy Authentication Required («необходима аутентификация прокси»)[2][3];
// 408 Request Timeout («истекло время ожидания»)[2][3];
// 409 Conflict («конфликт»)[2][3][4];
// 410 Gone («удалён»)[2][3];
// 411 Length Required («необходима длина»)[2][3];
// 412 Precondition Failed («условие ложно»)[2][3][9];
// 413 Payload Too Large («полезная нагрузка слишком велика»)[2][3];
// 414 URI Too Long («URI слишком длинный»)[2][3];
// 415 Unsupported Media Type («неподдерживаемый тип данных»)[2][3];
// 416 Range Not Satisfiable («диапазон не достижим»)[3];
// 417 Expectation Failed («ожидание не удалось»)[3];
// 418 I’m a teapot («я — чайник»);
// 419 Authentication Timeout (not in RFC 2616) («обычно ошибка проверки CSRF»);
// 421 Misdirected Request [10];
// 422 Unprocessable Entity («необрабатываемый экземпляр»);
// 423 Locked («заблокировано»);
// 424 Failed Dependency («невыполненная зависимость»);
// 425 Too Early («слишком рано»);
// 426 Upgrade Required («необходимо обновление»);
// 428 Precondition Required («необходимо предусловие»)[11];
// 429 Too Many Requests («слишком много запросов»)[11];
// 431 Request Header Fields Too Large («поля заголовка запроса слишком большие»)[11];
// 449 Retry With («повторить с»)[1];
// 451 Unavailable For Legal Reasons («недоступно по юридическим причинам»)[12].
// 499 Client Closed Request (клиент закрыл соединение);
// 5xx: Server Error (ошибка сервера):
// 500 Internal Server Error («внутренняя ошибка сервера»)[2][3];
// 501 Not Implemented («не реализовано»)[2][3];
// 502 Bad Gateway («плохой, ошибочный шлюз»)[2][3];
// 503 Service Unavailable («сервис недоступен»)[2][3];
// 504 Gateway Timeout («шлюз не отвечает»)[2][3];
// 505 HTTP Version Not Supported («версия HTTP не поддерживается»)[2][3];
// 506 Variant Also Negotiates («вариант тоже проводит согласование»)[13];
// 507 Insufficient Storage («переполнение хранилища»);
// 508 Loop Detected («обнаружено бесконечное перенаправление»)[14];
// 509 Bandwidth Limit Exceeded («исчерпана пропускная ширина канала»);
// 510 Not Extended («не расширено»);
// 511 Network Authentication Required («требуется сетевая аутентификация»)[11];
// 520 Unknown Error («неизвестная ошибка»)[15];
// 521 Web Server Is Down («веб-сервер не работает»)[15];
// 522 Connection Timed Out («соединение не отвечает»)[15];
// 523 Origin Is Unreachable («источник недоступен»)[15];
// 524 A Timeout Occurred («время ожидания истекло»)[15];
// 525 SSL Handshake Failed («квитирование SSL не удалось»)[15];
// 526 Invalid SSL Certificate («недействительный сертификат SSL»)[15].
