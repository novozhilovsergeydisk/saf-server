const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const { DTOFactory, log, promise, __STATIC, __VIEWS } = require('../../helpers.js');
// const { VIEWS_PATH } = require('../../../constants.js');
const nunjucks = require('nunjucks');
const conf = require('../../conf.js');
// const { parse } = require('querystring');

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
class mainControllers {
    async order(client) {
        const body = decodeURIComponent(client.body);

        // log({ body });

        const bodyArr = body.split('&');

        // log(bodyArr);

        bodyArr.map(item => {
            return item.split('=');
        });

        const formData = {};

        bodyArr.forEach(item => {
            const newArr = item.split('=');
            formData[newArr[0]] = newArr[1];
        });

        // log( formData.phone );

        const client_pg = new Client({
            user: "postgres",
            host: "localhost",
            database: "salon_groom",
            password: "postgres@12345",
            port: 5432
        });

        await client_pg.connect();

        // 1 select * from crm.clients where id = 1;

        const par = formData.phone + '';

        // log(typeof par);
        // log(typeof '+7(916)346-5407');

        const query = {
            // give the query a unique name
            name: 'fetch-crm.clients',
            text: 'SELECT * FROM crm.clients WHERE phone = $1::text',
            values: [par]
        }

        // const textSelect = "SELECT * FROM crm.clients WHERE phone = '" + par + "'";
        //
        // log({ textSelect });

        const valuesSelect = [par];
// callback
//         client_pg.query(query, (err, res) => {
//             if (err) {
//                 console.log(err.stack)
//             } else {
//                 console.log(res.rows[0])
//             }
//         });
// promise
        client_pg
            .query(query)
            .then(res => console.log({ 'rows': res.rows[0] }))
            .catch(e => console.error(e.stack));

        // END 1

        // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
        // const values = ['brianc', 'brian.m.carlson@gmail.com']

        const text = 'insert into crm.clients values(nextval(\'crm.clients_id_seq\'), $1, $2, $3) RETURNING *';
        const values = [formData.name, formData.phone, null];
// callback
//         client_pg.query(text, values, (err, res) => {
//             if (err) {
//                 console.log('ERROR');
//                 // console.log(err.stack);
//             } else {
//                 console.log(res.rows[0]);
//                 // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//             }
//         });
// promise
//         client_pg
//             .query(text, values)
//             .then(res => {
//                 console.log(res.rows[0])
//                 // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//             })
//             .catch(e => console.error(e.stack))

// async/await
        try {
            const res = await client_pg.query(text, values)
            const data = res.rows[0];

            if (data) {
                const mailOptions = {
                    from: conf.mailOptions.from,
                    to: conf.mailOptions.to,
                    subject: conf.mailOptions.subject,
                    text: 'Клиент: ' + data.name + ' -- ' + data.phone
                };

                transporter.sendMail(mailOptions, function(error, data){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ', data);
                    }
                });
            }

            // console.log({ data });
            // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
        } catch (err) {
            console.log(err.stack);
        }

        // console.log(res.rows[0]);
        // log({ newObj });

        // const client_pg = new Client();
        // await client_pg.connect();
        // const res = await client_pg.query('SELECT $1::text as message', ['Hello world!']);
        // console.log(res.rows[0].message); // Hello world!

        //return new Promise((resolve) => {

        // const insert = client_pg.query('insert into users values(nextval(\'users_id_seq\'), $1, $2, $3)', ['patient@transplant.' + generateToken(), generateToken(), false]);

        //});

        await client_pg.end();



        const jsonString = JSON.stringify(Object.assign({}, bodyArr))

        // log({ jsonString });

        return DTOFactory({ stream: body });
    }

    async send(client) {
        const body = decodeURIComponent(client.body);

        return DTOFactory({ stream: body });
    }

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

const staticController = {
    staticContent: async (client) => {
        // log(client)

        const stream = fs.createReadStream(__STATIC(client.url));
        // const stream = promise(__STATIC(client.url), 'Error static').then(() => fs.createReadStream(__STATIC(client.url))).catch(e => log(e));
        const dto = DTOFactory({ stream: stream });
        return dto;
    }
};

const mainController = new mainControllers();

module.exports = { mainController, staticController };
