'use strict';

// const UserModel = require('../models/user-model');
const users = require('../../models/Users/index.js');
const secret = require('../../conf.js');
//const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../mail-service/index.js');
// const db = require('../../lib/Database/index.js');
const {DTOFactory, log} = require('../../helpers');
const crypto = require('crypto');

log({ users })

// const pg = db.open({
//     user: 'postgres',
//     host: '127.0.0.1',
//     database: 'transplant_net_ru',
//     password: 'postgres_12345',
//     port: 5432
// });

class UserService {
    constructor() {}

    async register(email, password) {
        // const candidate = new Promise((resolve) => {
        //     const sql = 'users u';
        //     pg
        //         .select(sql)
        //         .where({'email': email})
        //         .fields(['u.id, u.email'])
        //         .then(data => {
        //             // log({ data });
        //
        //             resolve(data);
        //         });
        // });

        const candidate = users.find(email);

        log({ candidate })

        if (candidate) {
            throw new Error('пользователь с таким email уже существует')
        }

        //const hashPassword = await bcrypt.hash(password, 3);

        // const secret = 'abcdefg';
        const hashPassword = crypto.createHmac('sha256', password)
            .update('I love cupcakes')
            .digest('hex');

        log({ hashPassword });

        const activationLink = uuid.v4();

        log({ activationLink })

        // const user = await model.create({ email, password: hashPassword, activationLink });
        // await mailService.sendActivationMail(email, activationLink);

        return candidate;
        // model.query(sql, values).then(data => log({ 'data 1': data }));
        // model.query('SELECT NOW() as now').then(data => log({ 'data 2': data }));
    }

    findOne (email) {
        return new Promise();
    }

    create (email) {
        return new Promise();
    }

    cabinet(client) {
        // log({ 'client.url': client.url });

        // const parName = client.par.name;
        //
        // if (parName === 'id') {
        //
        // }

        //userService.cabinet(59);
        return DTOFactory({stream: 'cabinetControllers'});

        // const cabinetList = new Promise((resolve) => {
        //     const sql = 'cabinet c';
        //     pg
        //         .select(sql)
        //         .where({'id': id})
        //         // .fields(['u.id, u.email'])
        //         .order('id')
        //         .then(data => {
        //             log({ data });
        //
        //             resolve(data);
        //         });
        // });
        //
        // return cabinetList;
    }
}

module.exports = new UserService();
