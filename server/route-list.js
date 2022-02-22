'use strict';

const {patientController} = require('./controllers/patients.js');
const cabinetControllers  = require('./controllers/cabinet.js');
const reportsControllers  = require('./controllers/reports/index.js');
const auth                = require('./controllers/auth/index.js');
const {staticController}  = require('./controllers/main/index.js');

const routing = {
    'GET': {
        '/':                 patientController.main,
        '/index':            patientController.getAllPatients,
        '/index/*':          patientController.getAllPatients,
        '/test':             patientController.test,
        '/patient/id/*':     patientController.getPatient,
        '/patient/test':     patientController.test,
        '/api/activate/*':   auth.activate,
        '/api/refresh':      auth.refresh,
        '/api/cabinet/id/*': cabinetControllers.cabinet,
        '/css/*':            staticController.staticContent,
        '/js/*':             staticController.staticContent,
        '/img/*':            staticController.staticContent,
        '/api/register':     patientController.register,
        '/favicon.ico':      staticController.staticContent,
        '/reports/clinics':  reportsControllers.clinics,
        '/reports/clinic/*': reportsControllers.clinicById,
        '/user/add':         reportsControllers.addUser,
        '/sup/cab/list':     reportsControllers.supCabList
    },
    'POST': {
        '/user/add':         reportsControllers.addUser,
        '/register':         auth.register,
        '/activate/link/*':  auth.register,
        '/login':            auth.login,
        '/logout':           auth.logout
    }
};

module.exports = routing;
