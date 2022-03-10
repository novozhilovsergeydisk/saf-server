'use strict'

const path = require('path');
const fs = require('fs');
const { DTOFactory, __error } = require('../helpers.js');
const dto = require('../lib/DTO/index.js');

// const { VIEWS_PATH } = require('../const.js');
// const nunjucks = require('nunjucks');
const { tmpl } = require('../lib/Renderer/index.js');
// const cache = require(path.resolve(__dirname, '../lib/Cache/index.js'));
// log({ __dirname });
const userService = require('../services/user-service.js');
// const { parse } = require('querystring');

// const userService = new UserService();

// log(staticPath('/img'));

const cached = new Map();

// const fsCreateReadStream = fs.createReadStream;
// const memoize = cache.memoize(fsCreateReadStream);

// const fs = require('fs');

// args[0] - key
// args[args.length-1] - callback
// const memoizeAsync = (lib, fnName) => {
//     const fn = lib[fnName];
//     const cache = {};
//     console.log('override', fnName);
//     lib[fnName] = (...args) => {
//         console.dir({ call: fnName, args, cache });
//         const cb = args.pop();
//         const key = args[0];
//         const record = cache[key];
//         console.log('key:', key);
//         console.log('cached:', record);
//         if (record) {
//             console.log('from cache');
//             cb(record.err, record.data);
//             return;
//         }
//         fn(...args, (err, data) => {
//             console.log('from file');
//             console.log('Save key:', key);
//             cache[key] = { err, data };
//             console.dir({ cache });
//             cb(err, data);
//         });
//     };
// };

// Usage

// memoizeAsync(fs, 'fsCreateReadStream');



// nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Demo data
let patients = [
    {
        id: 1,
        fio: 'Иванов Иван'
    },
    {
        id: 2,
        fio: 'Петров Петр'
    },
    {
        id: 3,
        fio: 'Сидоров Андрей'
    }
];

// Handlers
class patientControllers {
    async test() {
        const render = tmpl.process({ patients: patients }, 'main/index.html');
        return dto.stream(render);
    }

    async main() {
        const render = tmpl.process({ patients: patients }, 'main/index.html');
        return dto.stream(render);
    }

    async refresh() {
        return dto.stream('refresh');
    }

    async activate() {
        return dto.stream('activate');
    }

    async register(client) {
        try {
            // log({ client });
            // log(typeof client.body);

            const {email, password} = JSON.parse(client.body);

            const userData = await userService.register(email, pasword);

            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return dto.stream(userData);
        } catch (e) {
            __ERROR(e)
        }
    }

    async getAllPatients() {
        const render = tmpl.process(patients, 'reports/index.html');
        return dto.stream(render);
    }

    async getPatient(client) {
        // log({ 'client': client.par.name });
        let patient = {};
        if (client.par.value) {
            const id = Number(client.par.value); //Number(req.params.id); // blog ID
            patient = patients.find(patient => patient.id === id);
        }
        // log({ patient });
        const dto = DTOFactory({ stream: JSON.stringify(patient) });
        return dto;
    }

    async addPatient() {
        const id = patients.length + 1; // generate new ID
        // return { foo: 'bar' };
        console.log({ id });
        const newPatient = {
            id,
            fio: req.body.fio
        };
        // console.log({ newPatient });
        patients.push(newPatient);
        return newPatient;
    }

    async updatePatient(req, reply) {
        const id = Number(req.params.id)
        patients = patients.map(patient => {
            if (patient.id === id) {
                return {
                    id,
                    fio: req.body.fio
                }
            }
        });
        return {
            id,
            fio: req.body.fio
        };
    }

    async deletePatient(req, reply) {
        const id = Number(req.params.id);
        patients = patients.filter(patient => patient.id !== id);
        return { msg: `Patient with ID ${id} is deleted` };
    }
}

const patientController = new patientControllers();

module.exports = { patients, patientController };
