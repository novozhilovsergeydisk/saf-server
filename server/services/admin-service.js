'use strict'

// const { database } = require('../conf.js');
// const db = require('../lib/DB');
const conf = require('../conf.js');
const { isNumber, select, query, generateToken, __ERROR, reject, log } = require('../helpers');
const { mail } = require('./mail-service.js');

// const pg = db.open( database );

class AdminService {
    constructor() {}

    async testClinics() {
        // return {foo: 'bar'}

        const sql = 'SELECT * FROM cabinet';
        return select(sql).catch(err => this.notify(err));
    }

    async clinics() {
        // return await {foo: 'bar'}

        const sql = 'SELECT * FROM cabinet';
        return await select(sql).catch(err => this.notify(err));
    }

    async inactiveAccountDays() {
        const sql = 'SELECT inactive_account_days FROM oneline';
        return select(sql).catch(err => this.notify(err));
    }

    async cabList() {
        const sql = 'SELECT id, name FROM cabinet ORDER BY name';
        return select(sql).catch(err => this.notify(err));
    }

    async admList(inactive_account_days,cab_id) {
        const sql = 'SELECT a.id, a.name, a.email, a.activate_key akey, $1 - datediff(\'day\', a.create_time, current_timestamp) ' +
            'days_left FROM account a INNER JOIN cab_acct ca on ca.account = a.id WHERE a.is_adm and ca.cabinet = $2 ORDER BY a.name';
        return query(sql, [inactive_account_days, cab_id]).catch(err => this.notify(err));
    }

    async docList(inactive_account_days, cab_id) {
        const sql = 'SELECT a.name, a.email, $1 - datediff(\'day\', a.create_time, current_timestamp) days_left, (select count(*) ' +
            'FROM v_channel where doctor = a.id) pat_cnt FROM account a INNER JOIN cab_acct ca on ca.account = a.id and a.is_doc ' +
            'WHERE ca.cabinet = $2 ORDER BY a.name';
        return query(sql, [inactive_account_days, cab_id]).catch(err => this.notify(err));
    }

    async patSnt(cab_id) {
        const sql = 'SELECT count(*) FROM account a INNER JOIN v_channel dp on dp.patient = a.id INNER JOIN cab_acct ca ' +
            'on ca.account = dp.doctor WHERE ca.cabinet = $1';
        return query(sql, [cab_id]).catch(err => this.notify(err));
    }

    async notify(error, sub = 'Ошибка сервиса', text = 'Error: ') {
        const mailOptions = {
            from: conf.mailOptions.from,
            to: conf.mailOptions.to,
            subject: sub,
            text: text + error
        };
        mail.options(mailOptions);
        mail.send();
        __ERROR(error)
    }

    async clinicById(id) {
        if (isNumber(id)) {
            const text = 'SELECT * FROM cabinet WHERE id = $1';

            const result = query(text, [id]).catch(err => this.notify(err));

            return result;
        }

        return reject('Wrong parameter');

        // return new Promise((resolve, reject) => reject('Wrong parameter'));
    }

    async addUser(client) {
        log(client.body)

        const faker = require('faker');
        const randomName = faker.name.findName();
        const randomEmail = faker.internet.email();
        const nextval = "nextval('transplant.clients_id_seq')";
        const text = `INSERT INTO transplant.clients VALUES(${nextval}, $1, $2, $3) RETURNING *`;
        const values = [randomName, randomEmail, generateToken()];
        return query(text, values);
    }

    addClient(client) {
        log(client.body)

        const faker = require('faker');
        const randomName = faker.name.findName();
        const randomEmail = faker.internet.email();
        const nextval = "nextval('transplant.clients_id_seq')";
        const text = `INSERT INTO transplant.clients VALUES(${nextval}, $1, $2, $3) RETURNING *`;
        const values = [randomName, randomEmail, generateToken()];
        return query(text, values);
    }
}

module.exports = new AdminService();
