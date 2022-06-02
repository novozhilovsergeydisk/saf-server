'use strict'

const path = require('path')

const {MIME_TYPES} = require('../constants.js')
const {getContent} = require('../server/controllers/main/index.js')
const {log} = require('../server/helpers.js')

function App() {

}

App.prototype.html = function(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.html)
    res.statusCode = status || 200
    res.end(data.toString())
}
App.prototype.json = function(res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(JSON.stringify(data))
}
App.prototype.send = function (res, data, mimeType, status) {
    res.setHeader('Content-Type', mimeType || MIME_TYPES.json)
    res.statusCode = status || 200
    res.end(data.toString())
}
App.prototype.getMimeType = function(req, mimeType) {
    const fileExt = path.extname(req.url).substring(1)
    mimeType = mimeType || MIME_TYPES[fileExt] || MIME_TYPES.html
    return mimeType
}
App.prototype.pipe = function(req, res, stream, mimeType) {
    mimeType = this.getMimeType(req, mimeType)
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 200
    stream.pipe(res)
}
App.prototype.error = function(req, res, status, mimeType, err) {
    res.setHeader('Content-Type', mimeType || this.getMimeType(req))
    res.statusCode = status || 404
    res.end(err || 'UNKNOWN ERROR')
}
App.prototype.error404 = function(req, res, err) {
    const mimeType = this.getMimeType(req)
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 404
    res.end(err || '404 - PAGE NOT FOUND')
}
App.prototype.error405 = function(req, res, err) {
    const mimeType = this.getMimeType(req)
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 405
    res.end(err || '405 - RESOURCE NOT FOUND')
}
App.prototype.error500 = function(req, res, err) {
    const mimeType = this.getMimeType(req)
    res.setHeader('Content-Type', mimeType)
    res.statusCode = 500
    res.end(err || '500 - SERVER ERROR')
}
App.prototype.resolveresource = function(req, res) {
    getContent(req.url).then(stream => {
        if (stream !== null) {
            const mimeType = this.getMimeType(req)
            this.pipe(req, res, stream, mimeType)
        } else {
            this.error450(res)
        }
    }).catch(err => {
        this.error500(res, err)
        this.console.log({ err })
    })
}

const isObject = (data => {
    return ((typeof data) === 'object') ? true : false
})

const isString = (data => {
    return ((typeof url) === 'string') ? true : false
})

const staticRoute = ((urls, router) => {
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
module.exports = { app, staticRoute }
