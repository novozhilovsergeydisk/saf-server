'use strict';

console.log('script start');

const dotenv = require('dotenv');
dotenv.config();

const {log} = require('./server/helpers.js');
const {handler} = require('./src/handler.js');
// const { Pool } = require('pg')

let sql;
let dataArray = [];
let result;

// sql = 'SELECT NOW()';
sql = 'SELECT id, name, email, is_pat patient, activate_time FROM account WHERE is_pat = true AND is_doc IS NULL AND is_adm IS NULL AND is_sup IS NULL ORDER BY activate_time DESC';
sql = 'SELECT * FROM current_catalog';

async function resolve(fn, ...arg) {
    let response;
    try {
        const args = Array.prototype.slice.call(arguments);

        log({ args })
        log(args.length)

        if (args.length < 2) {
            response = { status: 'failed', error: { message: 'Неверное число аргументов, должно быть минимум два параметра' } };
            log({ response })
            // return response;
        } else {
            response = isFunction(fn) ? { status: 'success', data: await fn(...arg) } : { status: 'failed', error: { message: 'Первый параметр не является функцией' } };
            log(response.data)
            // return response;
        }
        return response;
    } catch (err) {
        response = { status: 'failed', error: { message: 'Ошибка при вызове функции', info: err } };
        log({ response })
        return response;
    }
}

// const resolve = ((res, fn) => {
//     return res.then(entry => {
//         return isFunction(fn) ? fn(entry.data) : entry.data
//     }).catch(err => log({ err }))
// })

// const res = handler.query(sql)
// resolve(res, log)


result = resolve(handler.query, sql);
// dataArray.push(result);
//
// sql = 'SELECT NOW()';
// result = resolve(handler.query, sql);
// dataArray.push(result);

log({ dataArray })

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

