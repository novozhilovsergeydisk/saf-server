const path = require('path');
const fs = require('fs');
const dto = require('../../lib/DTO/index.js')
const { log, statPath, __STATIC, __VIEWS, __APP } = require('../../helpers.js');
const nunjucks = require('nunjucks');
// const conf = require('../../conf.js');
// const { existsSync } = require('fs');

const { access, constants } = require('fs');
// const file = path.join(__APP(), '/test.mjs'); // __dirname + '/../test.mjs';
const file = __APP('/test.mjs');

// Check if the file exists in the current directory.
access(file, constants.F_OK, (err) => {
    console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

nunjucks.configure(__VIEWS(), { autoescape: true });

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
class MainControllers {
    async index() {
        return DTOFactory({ stream: nunjucks.render('main/index.html', { main: [] }) });
    }

    async refresh() {
        return DTOFactory({ stream: 'refresh' });
    }

    async activate() {
        return DTOFactory({ stream: 'activate' });
    }

    async register(client) {
        try {
            // log({ client });
            // log(typeof client.body);

            const json = JSON.parse(client.body);

            // log(json.email);

            // const { req, res } = client;


            // userService.register();

            return DTOFactory({ stream: nunjucks.render('register/index.html', patients) });
        } catch (e) {

        }
    }

    async getAllPatients() {
        const dto = DTOFactory({ stream: nunjucks.render('index.html', patients) });
        // const dto = DTOFactory({ stream: { 'VIEWS_PATH': VIEWS_PATH } });
        // log({ dto });
        return dto;
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

class StaticControllers {
    async staticContent(client) {
        const url = client.url;
        let data = null;
        const stats = statPath(__STATIC(url));
        // if (stats && !stats.isDirectory()) {
        //     return fs.realpathSync(requestPath, Module._realpathCache);
        // }
        if(stats && stats.isFile()) {
            data = fs.createReadStream(__STATIC(url));
        }
        return dto.stream(data); //DTOFactory({ stream: stream });
    }
}

const mainController = new MainControllers();
const staticController = new StaticControllers();

module.exports = { mainController, staticController };
