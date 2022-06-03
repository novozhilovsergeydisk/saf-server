'use strict'

const {app, staticRoute} = require('../src/app.js')
const reportsController = require('../server/controllers/patients/index.js')
const {tmpl} = require('../server/lib/Renderer/index.js')
const {log} = require('../server/helpers.js')

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

Handler.prototype.getPatientMonthly = function (req, res) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        const body = Buffer.concat(bodyArr).toString() // bufferConcat(bodyArr) // bufferConcat
        // log({ bodyArr })
        // log({ body })
        // return body

        log({ 'body': body })
        log({ 'JSON.parse(body)': JSON.parse(body) })
        log('---------------------------------------------')

        return req.body = body

        // app.json(res, body)

    })
}



//

Handler.prototype.get = function (router) {
    router.on('GET', '/patients', handler.patients)
    router.on('GET', '/doctors', handler.doctors)
    router.on('GET', '/patients/monthly', (req, res) => {
        const render = tmpl.process({data: {}}, 'forms/user/index.html')
        app.html(res, render)
    })
    router.on('GET', '/form/user', (req, res) => {
        const patients = reportsController.monthlyReports(2022, 5)
        const render = tmpl.process({data: {title: '/form/user', patients: patients}}, 'forms/user/index.html')
        app.html(res, render)
    })
}

Handler.prototype.post = function (router) {
    router.on('POST', '/patients/monthly', (req, res) => {
        const data = handler.getPatientMonthly(req, res)

        data.then(data => log(data.body)).catch(err => log({ err }))

        // const body = data.body
        // log({ 'data': data })
        // const jsonParse = JSON.parse(body)
        // log({ jsonParse })
    })
}

const handler = new Handler()

// handler.get()
//
// handler.post()

module.exports = { handler, Handler }
