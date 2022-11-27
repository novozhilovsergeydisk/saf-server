'use strict';

const {MIME_TYPES} = require('../../../constants.js');
const { Pool } = require('pg');
const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv /*, {singleError: true} */);

const json = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json);
    res.statusCode = status || 200;
    res.end(JSON.stringify(data));
};

const html = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.html);
    res.statusCode = status || 200;
    res.end(data.toString());
};

const textPlain = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.plain);
    res.statusCode = status || 200;
    res.end(data.toString());
};

function isFunction(fn) {
    return ((typeof fn) === 'function')
}

async function resolve(fn, ...arg) {
    let response;
    try {
        const args = Array.prototype.slice.call(arguments);
        if (args.length < 2) {
            response = { status: 'failed', error: { message: 'Неверное число аргументов, должно быть минимум два параметра' } };
        } else {
            response = isFunction(fn) ? { status: 'success', data: await fn(...arg) } : { status: 'failed', error: { message: 'Первый параметр не является функцией' } };
            log({ response });
        }
        // log({ 'args.length': args.length });
        // log({ args });
        // log({ response });
        return response;
    } catch (err) {
        response = { status: 'failed', error: { message: 'Ошибка при вызове функции', info: err } };
        log({ response });
        return response;
    }
}

async function query (sql, params = []) {
    let response;
    try {
        const pool = new Pool();
        const result = pool.query(sql, params);
        return result.then(data => {
            pool.end();
            const rows = data.rows;
            response = { status: 'success', data: rows };
            return response;
        }).catch(error => {
            response = { status: 'failed', error: { message: 'Ошибка запроса к серверу БД', info: error } };
            console.log(error);
            return response;
        })
    } catch(error) {
        response = { status: 'failed', error: { message: 'Ошибка сервера БД', info: error } };
        console.log(error);
        return response;
    }
}

// ******* servicesController ******* //
class servicesController {
    async serviceAdd(req, res, data) {
        // console.log({ data })

        const schema = {
            type: 'object',
            required: ['formServicesName', 'formServicesPriceFrom', 'formServicesPriceTo'],
            allOf: [
                {
                    properties: {
                        formServicesName: { type: "string", minLength: 3 },
                        formServicesPriceFrom: { type: 'string', minLength: 2},
                        formServicesPriceTo: { type: 'string', minLength: 2}
                    },
                    additionalProperties: false,
                },
            ],
            errorMessage: {
                properties: {
                    formServicesName: 'Заполните поле <b>Название</b>, минимум 3 символа.',
                    formServicesPriceFrom: 'Заполните поле - <b>Цена от</b>.',
                    formServicesPriceTo: 'Заполните поле - <b>Цена до</b>.',
                },
            }
        }

        try {
            const validate = ajv.compile(schema);
            const validation = validate(data);

            if (validation) {
                const table = 'services';
                const schema = process.env.PGSCHEMA;
                const sequence = 'services_id_seq';
                const id = `nextval('${schema}.${sequence}')`;
                const sql = `INSERT INTO ${schema}.${table} VALUES(${id}, $1, $2, $3, now(), now()) RETURNING *`;
                const dataArray = [data.formServicesName, data.formServicesPriceFrom, data.formServicesPriceTo];
                const result = await query(sql, dataArray);

                if (result.status === 'failed') {
                    const response = { status: 'failed', error: { message: '<b>Ошибка при записи</b>. Возможно такие данные уже внесены.' } };
                    json(res, { response });
                } else {
                    const info = result.data;
                    const response = { status: 'success', data: { message: 'Информация успешно занесена в базу данных.', info } };
                    json(res, { response });
                }
            } else {
                const errorMessage = validate.errors[0].message;
                const response = { status: 'failed', error: { message: errorMessage } };
                json(res, { response });
                // console.log({ errorMessage });
            }
        } catch (err) {
            console.log({ err })
            const response = { status: 'failed', error: { message: 'Ошибка при обработке данных.' } };
            json(res, { response });
        }
    }
}

const __services__ = new servicesController();
module.exports = __services__;

