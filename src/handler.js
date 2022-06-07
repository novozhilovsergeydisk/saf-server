

const { Pool } = require('pg')
const pool = new Pool()

// const Ajv = require('ajv')
// const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}

const Ajv = require("ajv").default
const ajv = new Ajv({allErrors: true})
// Ajv option allErrors is required
require("ajv-errors")(ajv /*, {singleError: true} */)

const schema = {
    type: "object",
    required: ["foo", "bar"],
    allOf: [
        {
            properties: {
                foo: {type: "integer", minimum: 2},
                bar: {type: "string", minLength: 2},
            },
            additionalProperties: false,
        },
    ],
    errorMessage: {
        properties: {
            foo: "data.foo should be integer >= 2",
            bar: "data.bar should be string with length >= 2",
        },
    },
}

const validate = ajv.compile(schema)
console.log(validate({foo: 1, bar: "a"})) // false
console.log(validate.errors) // processed errors

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

// const schema = {
//     type: 'object',
//     properties: {
//         foo: {type: 'integer'},
//         bar: {type: 'string'}
//     },
//     required: ['foo', 'bar'],
//     additionalProperties: false
// }
//
// const data = {
//     foo: 1,
//     bar: 2
// }
//
// // const res = validate(schema, data)
// // log({ res })
//
// const validate = ajv.compile(schema)
// const valid = validate(data)
//
// if (!valid) {
//     log({ valid })
//     // return valid.errors
// } else {
//     log({ valid })
//     // return 'data is valid'
//     // log('data is valid')
// }

const {app} = require('../src/app.js')
const reportsController = require('../server/controllers/patients/index.js')
const {tmpl} = require('../server/lib/Renderer/index.js')
const {log} = require('../server/helpers.js')


function Handler() {
    if (!(this instanceof Handler)) {
        return new Handler()
    }
}

// Events handlers

Handler.prototype.onCrmClientInsert = async function(res, bodyArr) {
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

// Handler's methods

Handler.prototype.patients = function patients(req, res) {
    res.end('patients')
}

Handler.prototype.doctors = function doctors(req, res) {
    res.end('doctors')
}

Handler.prototype.crmClientInsert = function (req, res) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        handler.onCrmClientInsert(res, bodyArr)
    })
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

Handler.prototype.clientAdd = function (req) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        const body = Buffer.concat(bodyArr).toString()

        const { fio, email, phone } = JSON.parse(body)
        log({ 'fio': fio })
        log({ 'email': email })
        log({ 'phone': phone })
        // log({ 'body': body })
        // log({ 'JSON.parse(body)': JSON.parse(body) })
        log('---------------------------------------------')
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
    router.on('POST', '/crm/clients/insert', (req, res) => {
        handler.crmClientInsert(req, res)
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
