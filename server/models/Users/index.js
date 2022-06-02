'use strict';

const {query, log} = require('../../helpers');

class Users {
    constructor() {}

    async find (email) {
        if (email) {
            const text = 'SELECT * FROM transplant.clients WHERE email = $1';
            const res = await query(text, [email]);
            // log({ res })
            return res;
        }
        return null;
    }

    async create () {
        log('create()')
    }
}

module.exports = new Users();
