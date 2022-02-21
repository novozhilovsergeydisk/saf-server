// const nunjucks = require('nunjucks');
const userService = require('../services/user-service.js');

// Handlers
class cabinetControllers {
    async cabinet(client) {
        return userService.cabinet(client);
    }
}

const cabinetController = new cabinetControllers();

// console.log({ cabinetController });

module.exports = cabinetController;

