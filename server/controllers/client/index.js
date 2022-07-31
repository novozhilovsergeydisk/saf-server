'use strict';

// const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
// const adminService = require('../../services/admin-service/index.js');
// const {log} = require('../../helpers.js');
// const dto = require('../../lib/DTO/index.js');
// const {tmpl} = require('../../lib/Renderer/index.js');

// nunjucks.configure(VIEWS_PATH, { autoescape: true });

const {MIME_TYPES} = require('../../../constants.js');
const Ajv = require("ajv").default;
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv /*, {singleError: true} */);

const json = function (res, data, status) {
    res.setHeader('Content-Type', MIME_TYPES.json);
    res.statusCode = status || 200;
    res.end(JSON.stringify(data));
};

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
                const response = data;
                json(res, { response });
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

