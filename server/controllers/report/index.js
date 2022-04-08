const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
const adminService = require('../../services/admin-service/index.js');
const {log} = require('../../helpers.js');
const dto = require('../../lib/DTO/index.js');
const {tmpl} = require('../../lib/Renderer/index.js');
// const { VIEWS_PATH } = require('../../const.js');

// nunjucks.configure(VIEWS_PATH, { autoescape: true });

// Handlers
class reportsControllers {
    async clinics(client) {
        const data = await adminService.clinics();
        client.res.setHeader('reports', 'clinics');
        client.res.writeHead(200, { 'Connection': 'close' });
        client.res.end( `${data}` );
        log({ data })
        return 'headers_sent';
    }

    async getClinics(client) {
        const data = await adminService.clinics();
        client.res.setHeader('Content-Type', 'application/json');
        client.res.setHeader('reports', 'clinics');
        client.res.writeHead(200, { 'Connection': 'close' });
        client.res.end(JSON.stringify({ success: true, data: data }));
        log({ data })
        return 'headers_sent';
    }

    async clinicById(client) {
        const id = client.par.value;
        const data = adminService.clinicById(id);
        const stream = data
            .then(clinics => {
                log({ clinics });
                const patients = [{ title: "Иванов", id: 1 }, { title: "Новожилов", id: 2}, { title: "Гришин", id: 3}];
                const render = tmpl.process({ patients: patients, clinics: clinics }, 'reports/index.html');
                return render;

            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        return dto.stream(stream);
    }

    async addClient(cli) {
        // log({ cli });
        const data = adminService.addClient(cli);
        const stream = data
            .then(data => {
                // log({ data });

                return data;

            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        // log({ stream });

        // stream.then(d => {
        //     log({ d });
        // });

        return dto.stream(stream);
    }

    async addUser(client) {
        // const id = client.par.value;
        const data = adminService.addUser(client);
        const stream = data
            .then(data => {
                return 'addUser';
            })
            .catch(error => {
                log({ error });
                return '<h1>500</h1>' + `<strong>${error}</strong>`;
            });

        return dto.stream(stream);
    }
}

const reportsController = new reportsControllers();

module.exports = reportsController;