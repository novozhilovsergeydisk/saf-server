'use strict';

const reportsControllers = require('./controllers/report/index.js')
const {uploadController} = require('./controllers/upload/index.js')
const auth = require('./controllers/auth/index.js')
const {staticController, mainController} = require('./controllers/main/index.js')
const {responseController} = require('./services/response-service/index.js')
const { getContent }   = require('./lib/File/index.js')

// console.log({ 'uploadController': uploadController })

const routing = {
    'GET': {
        '/api/activate/*':   auth.activate,
        '/api/refresh':      auth.refresh,
        '/css/*':            staticController.staticContent,
        '/js/*':             staticController.staticContent,
        '/img/*':            getContent,
        '/img/doctors/*':    staticController.staticContent,
        '/api/register':     auth.register,
        '/favicon.ico':      staticController.staticContent,
        '/reports/clinic/*': reportsControllers.clinicById,
        '/user/add':         reportsControllers.addUser,
        '/sup/cab/list':     reportsControllers.supCabList,
        '/stat':             reportsControllers.stat,
        '/upload':           uploadController.index,
        '/robots/*':         staticController.staticContent,
        '/activate':         'activate',
        '/index':            mainController.index,
        '/test':             mainController.test,
    },
    'POST': {
        '/user/add':         reportsControllers.addUser,
        '/register':         auth.register,
        '/activate/link/*':  auth.activate,
        '/login':            auth.login,
        '/logout':           auth.logout,
        '/upload':           responseController.upload
    },
    'PUT': {
        '/upload': uploadController.upload,
    }
};

module.exports = routing;

