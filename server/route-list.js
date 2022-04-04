'use strict';

// const {patientController} = require('./controllers/patients.js')
// const cabinetControllers  = require('./controllers/cabinet.js')
// const reportsControllers  = require('./controllers/reports/index.js')
const {uploadController}  = require('./controllers/upload/index.js')
const auth                = require('./controllers/auth/index.js')
const {staticController}  = require('./controllers/main/index.js')
const getContent          = require('./lib/File/index.js')

const routing = {
    'GET': {
        '/api/activate/*':   auth.activate,
        '/api/refresh':      auth.refresh,
        '/css/*':            staticController.staticContent,
        '/js/*':             staticController.staticContent,
        '/img/*':            getContent,
        '/img/doctors/*':    staticController.staticContent,
        '/api/register':     patientController.register,
        '/favicon.ico':      staticController.staticContent,
        '/reports/clinics':  reportsControllers.clinics,
        '/reports/clinic/*': reportsControllers.clinicById,
        '/user/add':         reportsControllers.addUser,
        '/sup/cab/list':     reportsControllers.supCabList,
        '/stat':             reportsControllers.stat,
        '/upload':           uploadController.index,
        '/robots/*':         staticController.staticContent
    },
    'POST': {
        '/user/add':         reportsControllers.addUser,
        '/register':         auth.register,
        '/activate/link/*':  auth.register,
        '/login':            auth.login,
        '/logout':           auth.logout,
        '/upload':           uploadController.upload
    },
    'PUT': {
        '/upload': uploadController.upload,
    }
};

module.exports = routing;

