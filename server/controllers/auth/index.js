'use strict';

const {log} = require('../../helpers.js');
const dto = require('../../lib/DTO/index.js');
const {tmpl} = require('../../lib/Renderer/index.js');
const userService = require('../../services/user-service/index.js');

// Handlers
class Auth {
    async login(client) {

    }

    async register(client) {
        // log({ client })

        const data = dto.stream('test');

        // log({ data })

        return data;
    }

    async logout(client) {

    }
}

const auth = new Auth();

module.exports = auth;