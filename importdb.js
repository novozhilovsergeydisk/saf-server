'use strict'

console.log('script start')

const dotenv = require('dotenv')
dotenv.config()

const {log} = require('./server/helpers.js')
const {handler} = require('./src/handler.js')
// const { Pool } = require('pg')

let sql

sql = 'SELECT id, name, email, is_pat patient, activate_time FROM account WHERE is_pat = true AND is_doc IS NULL AND is_adm IS NULL AND is_sup IS NULL ORDER BY activate_time DESC'
sql = 'SELECT NOW()'
sql = 'SELECT * FROM current_catalog'
sql = 'DROP TABLE IF EXISTS crm.scheduleclients'
sql = 'DROP table IF EXISTS crm.recordspay;DROP table IF EXISTS crm.records;'

async function resolve(fn, ...arg) {
    let response
    try {
        const args = Array.prototype.slice.call(arguments)

        log({ args })
        log(args.length)

        if (args.length < 2) {
            response = { message: 'Неверное количество аргументов, должно быть минимум два параметра', info: null }
            log({ response })
            return response
        } else {
            response = isFunction(fn) ? await fn(...arg) : { status: 'failed', data: null, error: { message: 'Первый параметр не является функцией', info: null } }
            log(response.data)
            return response
        }
    } catch (err) {
        response = { status: 'failed', data: null, error: { message: 'Ошибка при вызове функции', info: err } }
        log({ response })
        return response
    }
}

// const resolve = ((res, fn) => {
//     return res.then(entry => {
//         return isFunction(fn) ? fn(entry.data) : entry.data
//     }).catch(err => log({ err }))
// })

// const res = handler.query(sql)
// resolve(res, log)

resolve(handler.query, sql)

// git add . && git commit -m "Modify files" && git push && clear

// const result = resolve(res)
// log({ result })

// res.then(entry => log(entry.data)).catch(err => log({ err }))

// (async () => ({
//     await handler.query(sql)
//     // console.log({ result })
// }))()

// const query = async (sql) => {
//     const result = await handler.query(sql)
//     // console.log({ result })
//     return result
// }

// pool.query(sql, (err, res) => {
//     // console.log({ err })
//     const rows = res.rows
//     console.log({ rows })
//     pool.end()
// })
function isFunction(fn) {
    return ((typeof fn) === 'function')
}

function isNumber(data) {
    return ((typeof data) === 'number')
}

function isString(data) {
    return ((typeof fn) === 'string')
}
//
// function cout(data) {
//     console.log({ data })
// }
// const query = await ((sql, fn) => {
//     console.log(typeof fn)
//     const pool = new Pool();
//     pool.query(sql, (err, res) => {
//         pool.end()
//         if (err) {
//             console.log({ err })
//             return
//         }
//         const rows = res.rows
//         if (isFunction(fn)) {
//             fn(rows)
//         }
//     })
// })

