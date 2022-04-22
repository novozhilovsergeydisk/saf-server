'use strict';

// const { database } = require('../conf.js');
// const db = require('../lib/DB');
const { promise, query, generateToken, log } = require('../../helpers');

// const pg = db.open( database );

class AdminService {
    constructor() {}

    async clinics(client) {
        const text = 'SELECT * FROM cabinet ORDER BY name';
        const res = await query(text, []);
        // const data = res[0];
        return res;
        // return { patList: {  id: 159, name: 'Гришин C.B.', email: 'jabapoint@list.ru', days_left: -516  } }
    }

    async clinicById(client) {
        let stream = null;
        const id = client.par.value;

        // log(cached.size);

        if (cached.has(`clinicById(${id})`)) {
            console.time('cached-clinicHTML');
            const clinics = cached.get(`clinicById(${id})`);
            if (cachedHTML.has(`clinicById
            (${id})`)) {
                const render = cachedHTML.get(`clinicById(${id})`)
                stream = promise(render);
            } else {
                const render = nunjucks.render('reports/index.html', { clinics: clinics });
                cachedHTML.set(`clinicById(${id})`, render);
                stream = promise(render);
            }
            console.timeEnd('cached-clinicHTML');
            log({ 'cachedHTML.size':cachedHTML.size })
            return DTOFactory({ stream: stream });
            // cached.set(`clinicById(${id})`, clinics);
        } else {
            console.time('clinicById');
            const data = adminService.clinicById(id)
            ;
            stream = data
                .then(clinics => {
                    if (!cached.has(`clinicById(${id})`)) {
                        cached.set(`clinicById(${id})`, clinics);
                    }
                    // const patients = [{ title: "Иванов", id: 1 }, { title: "Новожилов", id: 2}, { title: "Гришин", id: 3}];
                    const render = nunjucks.render('reports/index.html', { clinics: clinics });

                    // log(typeof render);

                    return render;

                })
                .catch(error => {
                    log({ error });
                    return '<h1>500</h1>' + `<strong>${error}</strong>`;
                });
            console.timeEnd('clinicById');
            log({ 'cachedHTML.size':cachedHTML.size })
            return DTOFactory({ stream: stream });
        }
    }

    async addUser(data) {
        // log(data)
        // const faker = require('faker');
        const name = data.name; // faker.name.findName();
        const phone = data.phone; // faker.internet.email();
        const nextval = "nextval('transplant.clients_id_seq')";
        const text = `INSERT INTO transplant.clients VALUES(${nextval}, $1, $2, $3) RETURNING *`;
        const values = [name, phone, generateToken(10)];

        log({ values })

        return query(text, values);
    }

    addClient(client) {
        // const body = client.body;
        const { name, phone } = client.body;
        const faker = require('faker');
        const randomName = faker.name.findName();
        const randomEmail = faker.internet.email();
        const id = "nextval('transplant.clients_id_seq')";
        const text = `INSERT INTO transplant.clients VALUES(id, $1, $2, $3) RETURNING *`;
        const values = [randomName, randomEmail, generateToken()];

        log({ values });

        return query(text, values);
    }

    async clientByPhone(phone) {
        if (phone) {
            const text = 'SELECT * FROM transplant.clients WHERE phone = $1';
            const res = await query(text, [phone]);
            return res;
        }
    }

}

module.exports = new AdminService();