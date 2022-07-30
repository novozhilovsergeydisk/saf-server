'use strict'

const Ajv = require("ajv").default
const ajv = new Ajv({ allErrors: true })
require("ajv-errors")(ajv /*, {singleError: true} */)
const { log } = require('../server/helpers.js')

// const fio = 'Новожилов'
// const phone = '+7 916 346-54-07'
//
// log({ fio })
//
// const schema = {
//     type: "object",
//     required: ["fio", "phone"],
//     allOf: [
//         {
//             properties: {
//                 fio: {type: "string", minLength: 4},
//                 phone: {type: "string", minLength: 10},
//             },
//             additionalProperties: false,
//         },
//     ],
//     errorMessage: {
//         properties: {
//             fio: "Имя должно содержать не менее 4 символов",
//             phone: "Поле телефон должно содержать не менее 10 символов",
//         },
//     },
// }
//
// try {
//     const validate = ajv.compile(schema)
//     const validation = validate({fio: fio, phone: phone})
//     log({ validation })
//     if (validation) {
//         const response = {status: 'success', data: {foo: 'test'}, error: null}
//         log({ response })
//     } else {
//         const error = validate.errors[0].message
//         const response = {status: 'failed', data: null, error: {message: 'Ошибка валидации 1', info: error}}
//         log({ response })
//     }
// } catch(err) {
//     const response = {status: 'failed', data: null, error: {message: 'Ошибка при валидации данных 2', info: err}}
//     log({ response })
// }

const { Pool } = require('pg')
const { query } = require('../server/lib/DB/index.js')
// const pool = new Pool()

const { app } = require('../src/app.js')
const reportsController = require('../server/controllers/patients/index.js')
const { tmpl } = require('../server/lib/Renderer/index.js')
// const {log} = require('../server/helpers.js')

// const Ajv = require("ajv").default
// const ajv = new Ajv({allErrors: true})
// require("ajv-errors")(ajv /*, {singleError: true} */)

function Handler() {
    if (!(this instanceof Handler)) {
        return new Handler()
    }
}

// ******* Events handlers

// get

Handler.prototype.getPatients = async function () {
    const pool = new Pool()
    const sql = `SELECT * FROM account WHERE pat = true`
    const result = pool.query(sql)
    return result.then(data => {
        pool.end()
        log(data.rows)
        const response = { status: 'success', data: data.rows, error: null }
        log({ response })
        return response
    }).catch(err => {
        const responseError = { status: 'failed', data: null, error: { message: 'Ошибка сервера БД', info: err } }
        log({ err })
        return response
    })
}

Handler.prototype.select = async function (sql) {
    const pool = new Pool()
    const result = pool.query(sql)
    return result.then(data => {
        pool.end()
        const rows = data.rows
        const response = { status: 'success', data: rows, error: null }
        log({ response })
        return response
    }).catch(err => {
        const responseError = { status: 'failed', data: null, error: { message: 'Ошибка сервера БД', info: err } }
        log({ err })
        return response
    })
}

Handler.prototype.query = async function (sql) {
    let response
    let error

    const getError = () => {
        return error
    }

    const setError = (err) => {
        error = err
    }

    const validSql = handler.isString(sql)
    // if (validSql === false) {
    //     response = { status: 'failed', error: { message: 'sql запрос должен быть строкой', info: null } }
    //     log({ response })
    //     return response
    // }
    try {
        const pool = new Pool()
        const result = pool.query(sql)
        return result.then(data => {
            pool.end()
            const rows = data.rows
            response = { status: 'success', data: rows }
            return response
        }).catch(error => {
            setError(error)
            response = { status: 'failed', error: { message: 'Ошибка запроса к серверу БД', info: error } }
            log(error)
            return response
        })
    } catch(error) {
        setError(error)
        response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: error } }
        log(error)
        return response
    }
}

Handler.prototype.getClients = async function () {
    const pool = new Pool()
    const sql = `SELECT * FROM crm.clients`
    const result = pool.query(sql)
    return result.then(data => {
        pool.end()
        // log(data.rows)
        const response = { status: 'success', data: data.rows, error: null }
        // log({ response })
        return response
    }).catch(err => {
        const responseError = { status: 'failed', error: { message: 'Ошибка сервера БД', info: err } }
        log({ err })
        return response
    })
}

// inser
//

Handler.prototype.log = function (response) {
    log({ response })
}

Handler.prototype.detail = function (res) {
    log({ 'info': res.error.info })
}

Handler.prototype.recordPayInsert = async function (res, bodyArr) {
    const pool = new Pool()
    let parsingData, validate, validation, clientpaySum, clientpayRecordsList
    const body = Buffer.concat(bodyArr).toString()

    try {
        log({ body })
        parsingData = JSON.parse(body)
        log({ parsingData })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при обработке данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    const schema = {
        type: 'object',
        required: ['clientpaySum', 'clientpayRecordsList'],
        allOf: [
            {
                properties: {
                    clientpaySum: { type: 'integer', minimum: 50 },
                    clientpayRecordsList: { type: 'integer', minimum: 1 }
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                clientpaySum: 'Сумма должна быть не менее 50',
                clientpayRecordsList: 'Выберите значение из списка'
            },
        },
    }

    try {
        validate = ajv.compile(schema)

        clientpaySum = parsingData.clientpaySum
        clientpayRecordsList = parsingData.clientpayRecordsList

        validation = validate({ clientpaySum: Number(clientpaySum), clientpayRecordsList: Number(clientpayRecordsList) })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при валидации данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    log({ validation })

    if (validation) {
        const id = 'crm.recordspay_id_seq'
        const sql = `INSERT INTO crm.recordspay VALUES(nextval('${id}'), $2, now(), $1) RETURNING id`

        log({ '[clientpaySum, clientpayRecordsList]': [clientpaySum, clientpayRecordsList] })

        const result = pool.query(sql, [clientpaySum, clientpayRecordsList])
        result.then(data => {
            pool.end()
            const response = { status: 'success', data: data.rows[0], error: null }
            log({ response })
            app.json(res, response)
        }).catch(err => {
            const response = { status: 'failed', data: null, error: { message: 'Ошибка сервера БД @', info: err } }
            // log({ response })
            handler.detail(response)
            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = { status: 'failed', data: null, error: { message: 'Ошибка валидации', info: error } }
        log({ response })
        app.json(res, response)
    }
}

Handler.prototype.recordInsert = async function (res, bodyArr) {
    const pool = new Pool()
    let parsingData, validate, validation, recordsClientsList, recordsServicesList, recordsDate, recordsTime, validateData
    const body = Buffer.concat(bodyArr).toString()

    try {
        log({ body })
        parsingData = JSON.parse(body)
        log({ parsingData })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при обработке данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    const schema = {
        type: 'object',
        required: ['recordsClientsList', 'recordsServicesList', 'recordsDate', 'recordsTime'],
        allOf: [
            {
                properties: {
                    recordsClientsList: { type: 'integer', minimum: 1 },
                    recordsServicesList: { type: "integer", minimum: 1 },
                    recordsDate: { type: "string", minLength: 10 },
                    recordsTime: { type: "string", minLength: 5 }
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                recordsClientsList: 'Выберите значение из списка',
                recordsServicesList: 'Выберите значение из списка',
                recordsDate: 'Выберите дату приема',
                recordsTime: 'Установите время приема'
            },
        },
    }

    try {
        validate = ajv.compile(schema)
        recordsClientsList = parsingData.recordsClientsList
        recordsServicesList = parsingData.recordsServicesList
        recordsDate = parsingData.recordsDate
        recordsTime = parsingData.recordsTime
        validateData = {recordsClientsList: parseInt(recordsClientsList), recordsServicesList: Number(recordsServicesList), recordsDate: String(recordsDate), recordsTime: String(recordsTime)}
        log({ validateData })
        validation = validate(validateData)
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при валидации данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    log({ validation })

    if (validation) {
        const id = 'crm.records_id_seq'
        const sql = `INSERT INTO crm.records VALUES(nextval('${id}'), $1, $2, $3) RETURNING id`

        const result = pool.query(sql, [recordsClientsList, recordsServicesList, recordsDate + ' ' + recordsTime])
        result.then(data => {
            pool.end()
            const response = { status: 'success', data: data.rows[0], error: null }
            log({ response })
            app.json(res, response)
        }).catch(err => {
            const response = { status: 'failed', data: null, error: { message: 'Ошибка сервера БД', info: err } }
            log({ response })
            log({ 'detail': response.error.info.detail })
            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = { status: 'failed', data: null, error: { message: 'Ошибка валидации', info: error } }
        log({ response })
        log({ 'detail': response.error.info.detail })
        app.json(res, response)
    }
}

Handler.prototype.serviceInsert = async function (res, bodyArr) {
    const pool = new Pool()
    let parsingData, validate, validation, servicesName, servicesPriceFrom, servicesPriceTo
    const body = Buffer.concat(bodyArr).toString()

    try {
        log({ body })
        parsingData = JSON.parse(body)
        log({ parsingData })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при обработке данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    const schema = {
        type: 'object',
        required: ['servicesName', 'servicesPriceFrom', 'servicesPriceTo'],
        allOf: [
            {
                properties: {
                    servicesName: { type: 'string', minLength: 4 },
                    servicesPriceFrom: { type: "integer", minimum: 50 },
                    servicesPriceTo: { type: "integer", minimum: 50 }
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                servicesName: 'Название услуги должно содержать не менее 4 символов',
                servicesPriceFrom: 'Числовое поле <Цена от> должно быть > 50',
                servicesPriceTo: 'Числовое поле <Цена до> должно быть > 50'
            },
        },
    }

    try {
        validate = ajv.compile(schema)
        servicesName = parsingData.servicesName
        servicesPriceFrom = parsingData.servicesPriceFrom
        servicesPriceTo = parsingData.servicesPriceTo
        validation = validate({ servicesName: servicesName, servicesPriceFrom: Number(servicesPriceFrom), servicesPriceTo: Number(servicesPriceTo) })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при валидации данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    log({ validation })

    if (validation) {
        const id = 'crm.clients_id_seq'
        const sql = `INSERT INTO crm.services VALUES(nextval('${id}'), $1, $2, $3, now(), now()) RETURNING id`

        const result = pool.query(sql, [servicesName, servicesPriceFrom, servicesPriceTo])
        result.then(data => {
            pool.end()
            log({ data })
            const response = { status: 'success', data: data.rows[0], error: null }
            log({ response })
            app.json(res, response)
        }).catch(err => {
            const response = { status: 'failed', data: null, error: { message: 'Ошибка сервера БД', info: err } }
            log({ response })
            log({ 'detail': response.error.info.detail })
            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = { status: 'failed', data: null, error: { message: 'Ошибка валидации', info: error } }
        log({ response })
        log({ 'detail': response.error.info.detail })
        app.json(res, response)
    }
}

Handler.prototype.clientInsert = async function (res, bodyArr) {
    const pool = new Pool()
    let parsingData, validate, validation, fio, phone, email
    const body = Buffer.concat(bodyArr).toString()

    try {
        parsingData = JSON.parse(body)
        log({ body })
        log({ parsingData })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при обработке данных', info: err } }
        app.json(res, response, 500)
        return
    }

    const schema = {
        type: "object",
        required: ["fio", "phone"],
        allOf: [
            {
                properties: {
                    fio: { type: "string", minLength: 4 },
                    phone: { type: "string", minLength: 10 },
                    email: { type: 'string' }
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                fio: "Имя должно содержать не менее 4 символов",
                phone: "Поле телефон должно содержать не менее 10 символов",
                email: 'Поле email должно быть строковым'
            },
        },
    }

    try {
        validate = ajv.compile(schema)
        fio = parsingData.fio
        phone = parsingData.phone
        email = parsingData.email
        validation = validate({ fio: fio, phone: phone, email: email })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при валидации данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    log({ validation })

    if (validation) {
        const id = 'crm.clients_id_seq'
        // const sql = 'SELECT NOW()'
        const sql = `INSERT INTO crm.clients VALUES(nextval('${id}'), $1, $2, $3) RETURNING id`
        const dataInsert = [fio, phone, email]
        const result = pool.query(sql, dataInsert)
        result.then(data => {
            pool.end()
            // log({ data })
            const response = { status: 'success', data: data.rows[0], error: null }
            app.json(res, response)
        }).catch(err => {
            const response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: err } }
            handler.log(response)
            handler.detail(response)



            app.json(res, response)
        })
    } else {
        const error = validate.errors[0].message
        const response = { status: 'failed', error: { message: 'Ошибка валидации', info: error } }
        log({ response })
        handler.detail(response)
        app.json(res, response)
    }
}

// Handler's crud methods

Handler.prototype.store = function (req, res, fn) {
    let bodyArr = [];
    req.on('data', chunk => {
        bodyArr.push(chunk)
    })
    return req.on('end', async () => {
        fn(res, bodyArr)
    })
}

// END Handler's crud methods

Handler.prototype.admin = function (req, res) {
    const sql = `SELECT * FROM crm.clients`;

    const result = query(sql);

    return result.then(data => {
        log(data.rows)
        const response = { status: 'success', data: data.rows }
        log({ response })
    }).catch(error => {
        const responseError = { status: 'failed', error: { message: 'Ошибка сервера БД', info: err } }
        log({ error })
    })

    const render = tmpl.process({ data: null }, 'admin2/template/index.html')
    app.html(res, render)
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

Handler.prototype.clientAdd = function (req, res) {
    // let bodyArr = [];
    // req.on('data', chunk => {
    //     bodyArr.push(chunk)
    // })
    // return req.on('end', async () => {
    //     const body = Buffer.concat(bodyArr).toString()
    //
    //     const { fio, email, phone } = JSON.parse(body)
    //     // log({ 'fio': fio })
    //     // log({ 'email': email })
    //     // log({ 'phone': phone })
    //     // log({ 'body': body })
    //     // log({ 'JSON.parse(body)': JSON.parse(body) })
    //     // log('---------------------------------------------')
    // })

    let parsingData, validate, validation, recordsClientsList, recordsServicesList, recordsDate, recordsTime, validateData

    const body = Buffer.concat(bodyArr).toString()

    try {
        log({ body })
        parsingData = JSON.parse(body)
        log({ parsingData })
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при обработке данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }

    const schema = {
        type: 'object',
        required: ['recordsClientsList', 'recordsServicesList', 'recordsDate', 'recordsTime'],
        allOf: [
            {
                properties: {
                    recordsClientsList: { type: 'integer', minimum: 1 },
                    recordsServicesList: { type: "integer", minimum: 1 },
                    recordsDate: { type: "string", minLength: 10 },
                    recordsTime: { type: "string", minLength: 5 }
                },
                additionalProperties: false,
            },
        ],
        errorMessage: {
            properties: {
                recordsClientsList: 'Выберите значение из списка',
                recordsServicesList: 'Выберите значение из списка',
                recordsDate: 'Выберите дату приема',
                recordsTime: 'Установите время приема'
            },
        },
    }

    try {
        validate = ajv.compile(schema)
        recordsClientsList = parsingData.recordsClientsList
        recordsServicesList = parsingData.recordsServicesList
        recordsDate = parsingData.recordsDate
        recordsTime = parsingData.recordsTime
        validateData = {recordsClientsList: parseInt(recordsClientsList), recordsServicesList: Number(recordsServicesList), recordsDate: String(recordsDate), recordsTime: String(recordsTime)}
        log({ validateData })
        validation = validate(validateData)
    } catch (err) {
        const response = { status: 'failed', data: null, error: { message: 'Ошибка при валидации данных', info: err } }
        log({ response })
        app.json(res, response, 500)
        return
    }
}

// routes

Handler.prototype.get = function (router) {
    router.on('GET', '/admin__', handler.admin)
    router.on('GET', '/patients', handler.patients)
    router.on('GET', '/doctors', handler.doctors)
    router.on('GET', '/patients/monthly', (req, res) => {
        const render = tmpl.process({ data: {} }, 'forms/user/index.html')
        app.html(res, render)
    })
    router.on('GET', '/form/user', (req, res) => {
        const patients = reportsController.monthlyReports(2022, 5)
        const render = tmpl.process({ data: { title: '/form/user', patients: patients } }, 'forms/user/index.html')
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
    router.on('POST', '/crm/recordspay/insert', (req, res) => {
        handler.store(req, res, handler.recordPayInsert)
    })

    router.on('POST', '/crm/records/insert', (req, res) => {
        handler.store(req, res, handler.recordInsert)
    })

    router.on('POST', '/crm/services/insert', (req, res) => {
        log('crm/services/insert')
        handler.store(req, res, handler.serviceInsert)
    })

    router.on('POST', '/crm/clients/insert', (req, res) => {
        handler.store(req, res, handler.clientInsert)
    })

    router.on('POST', '/patients/monthly', (req, res) => {
        const data = handler.getPatientMonthly(req, res)
        data.then(data => log(data.body)).catch(err => log({ err }))
    })
}

Handler.prototype.isFunction = function (fn) {
    return ((typeof fn) === 'function')
}

Handler.prototype.isNumber = function (data) {
    return ((typeof data) === 'number')
}

Handler.prototype.isString = function (data) {
    return ((typeof data) === 'string')
}

// crm

const handler = new Handler()

// handler.get()
//
// handler.post()

module.exports = { handler }
