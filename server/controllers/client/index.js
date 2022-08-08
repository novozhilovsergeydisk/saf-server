'use strict';

// const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
// const adminService = require('../../services/admin-service/index.js');
// const {log} = require('../../helpers.js');
// const dto = require('../../lib/DTO/index.js');
// const {tmpl} = require('../../lib/Renderer/index.js');

// nunjucks.configure(VIEWS_PATH, { autoescape: true });

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

// clientsController
class clientController {
    async clientAdd(req, res, data) {
        console.log({ data })
        const schema = {
            type: 'object',
            required: ['fio', 'phone', 'email'],
            allOf: [
                {
                    properties: {
                        fio: { type: "string", minLength: 2 },
                        phone: { type: "string", minLength: 8 },
                        email: { type: "string", minLength: 6 },
                    },
                    additionalProperties: false,
                },
            ],
            errorMessage: {
                properties: {
                    fio: 'Минимум 2 символа',
                    phone: 'Минимум 8 символов',
                    email: 'Минимум 6 символов',
                },
            },
        }

        try {
            const validate = ajv.compile(schema);
            const validation = validate(data);
            console.log({ validation })

            if (validation) {
                // const response = { status: 'success', data };
                const table = 'clients';
                const schema = process.env.PGSCHEMA;
                const sequence = 'clients_id_seq';
                const id = `nextval('${schema}.${sequence}')`;
                const sql = `INSERT INTO ${schema}.${table} VALUES(${id}, $1, $2, $3) RETURNING *`;

                const result = await query(sql, [data.fio, data.phone, data.email]);

                if (result.status === 'failed') {
                    const response = { status: 'failed', error: { message: 'Ошибка при записи в базу данных' } };
                    json(res, { response });
                } else {
                    const __result__ = result.data;
                    const response = { status: 'success', data: { message: 'Информация успешно занесена в базу данных', __result__ } };
                    json(res, { response });
                }

                // console.log([data.fio, data.phone, data.email])
                // console.log(data.phone)
                // console.log(data.email)
                // console.log({ result })


            } else {
                const response = { status: 'failed', error: { message: 'Ошибка при валидации данных' } };
                json(res, { response });
            }
        } catch (err) {
            console.log({ err })
            const response = { status: 'failed', error: { message: 'Ошибка при обработке данных' } };
            json(res, { response });
        }
    }

}

const __client__ = new clientController();
module.exports = __client__;

