

const { Pool } = require('pg')
const pool = new Pool()

const {app} = require('../src/app.js')
const reportsController = require('../server/controllers/patients/index.js')
const {tmpl} = require('../server/lib/Renderer/index.js')
const {log} = require('../server/helpers.js')

const Ajv = require("ajv").default
const ajv = new Ajv({allErrors: true})
// Ajv option allErrors is required
require("ajv-errors")(ajv /*, {singleError: true} */)

function Handler() {
    if (!(this instanceof Handler)) {
        return new Handler()
    }
}

// Events handlers

Handler.prototype.serviceInsert = async function(res, bodyArr) {
    const body = Buffer.concat(bodyArr).toString()
    const data = { servicesName, servicesPriceFrom, servicesPriceTo } = JSON.parse(body)

    log({ data })

    const schema = {
        type: 'object',
        required: ['servicesName'],
        allOf: [
            {
                properties: {
                    servicesName: {type: 'string', minLength: 4},
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                servicesName: 'Название услуги должно содержать не менее 4 символов'
            },
        },
    }

    const validate = ajv.compile(schema)
    const validation = validate({servicesName: servicesName})

    log({ validation })

    if (validation) {
        const id = 'crm.clients_id_seq'
        // const sql = 'SELECT NOW()'
        const sql = `INSERT INTO crm.services VALUES(nextval('${id}'), $1, now(), now()) RETURNING id`

        const result = pool.query(sql, [servicesName])
        result.then(data => {
            // pool.end()
            const response = {status: 'success', data: data.rows[0], error: null}
            log({ response })
            app.json(res, response)
        }).catch(err => {
            const response = {status: 'failed', data: null, error: {message: 'Ошибка сервера БД', info: err}}
            log({ response })
            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = {status: 'failed', data: null, error: {message: 'Ошибка валидации', info: error}}
        log({ response })
        app.json(res, response)
    }
}

Handler.prototype.clientInsert = async function(res, bodyArr) {
    // log('Handler.prototype.onCrmClientInsert')
    const body = Buffer.concat(bodyArr).toString()
    const { fio, phone, email } = JSON.parse(body)

    const schema = {
        type: "object",
        required: ["fio", "phone"],
        allOf: [
            {
                properties: {
                    fio: {type: "string", minLength: 4},
                    phone: {type: "string", minLength: 10},
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                fio: "Имя должно содержать не менее 4 символов",
                phone: "Поле телефон должно содержать не менее 10 символов",
            },
        },
    }

    const validate = ajv.compile(schema)
    const validation = validate({fio: fio, phone: phone})

    log({ validation })

    if (validation) {
        const id = 'crm.clients_id_seq'
        // const sql = 'SELECT NOW()'
        const sql = `INSERT INTO crm.clients VALUES(nextval('${id}'), $1, $2, $3) RETURNING id`

        const result = pool.query(sql, [fio, phone, email])
        result.then(data => {
            // pool.end()
            const response = {status: 'success', data: data.rows[0], error: null}
            log({ response })
            app.json(res, response)
        }).catch(err => {
            const response = {status: 'failed', data: null, error: {message: 'Ошибка сервера БД', info: err}}
            log({ response })
            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = {status: 'failed', data: null, error: {message: 'Ошибка валидации', info: error}}
        log({ response })
        app.json(res, response)
    }
}

// Handler's crud methods

Handler.prototype.save = function (req, res, fn) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        fn(res, bodyArr)
    })
}

// END Handler's crud methods


Handler.prototype.patients = function patients(req, res) {
    res.end('patients')
}

Handler.prototype.doctors = function doctors(req, res) {
    res.end('doctors')
}

// Handler.prototype.crmClientInsert = function (req, res) {
//     let bodyArr = [];
//     req.on('data', chunk => {
//         bodyArr.push(chunk)
//     })
//     return req.on('end', async () => {
//         handler.onCrmClientInsert(res, bodyArr)
//     })
// }

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

Handler.prototype.clientAdd = function (req) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        const body = Buffer.concat(bodyArr).toString()

        const { fio, email, phone } = JSON.parse(body)
        // log({ 'fio': fio })
        // log({ 'email': email })
        // log({ 'phone': phone })
        // log({ 'body': body })
        // log({ 'JSON.parse(body)': JSON.parse(body) })
        // log('---------------------------------------------')
    })
}

// HTTP methods

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

Handler.prototype.put = function (router) {
    router.on('PUT', 'put/client/add', (req, res) => {
        handler.clientAdd(req, res)

        // data.then(data => log({ 'data.then': data.body })).catch(err => log({ err }))

        // const body = data.body
        // log({ 'data': data })
        // const jsonParse = JSON.parse(body)
        // log({ jsonParse })
    })

    router.on('PUT', 'put/patients/monthly', (req, res) => {
        const data = handler.getPatientMonthly(req, res)

        data.then(data => log(data.body)).catch(err => log({ err }))

        // const body = data.body
        // log({ 'data': data })
        // const jsonParse = JSON.parse(body)
        // log({ jsonParse })
    })
}

Handler.prototype.post = function (router) {
    router.on('POST', '/crm/records/insert', (req, res) => {
        handler.save(req, res, handler.clientInsert)
    })

    router.on('POST', '/crm/services/insert', (req, res) => {
        log('crm/services/insert')
        handler.save(req, res, handler.serviceInsert)
    })

    router.on('POST', '/crm/clients/insert', (req, res) => {
        handler.save(req, res, handler.clientInsert)
    })

    router.on('POST', '/patients/monthly', (req, res) => {
        const data = handler.getPatientMonthly(req, res)
        data.then(data => log(data.body)).catch(err => log({ err }))
    })


}

const handler = new Handler()

// handler.get()
//
// handler.post()

module.exports = { handler }
