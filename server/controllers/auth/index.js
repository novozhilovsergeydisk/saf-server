const path = require('path');
const fs = require('fs');
const { log } = require('../../helpers.js');

log('auth/index.js');

// Handlers
class authControllers {
    async login(client) {
        // client.setCookie('me', 'my', true).sendCookie().deleteCookie('foo').deleteCookie('wi').deleteCookie('hi');
        // client.sendCookie();
        // log({ client })
        // log('login')

        log(client.session)

        return 'login';
    }

    async logout () {
        console.log("logout");
    }

    async activate () {
        console.log("activate");
    }

    async register (client) {
        // try {
        //     const { email, password } = JSON.parse(client.body);
        //
        //     const userData = userService.register(email, pasword);
        //
        //     // res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        //
        //
        //     return DTOFactory({ stream: userData });
        // } catch(e) {
        //
        // }

        console.log("register");
        return 'register';
    }

    async refresh () {
        console.log("refresh");
    }

    async token () {
        console.log("token");
    }
}

const auth = new authControllers();

module.exports = auth;