'use strict'

// const nunjucks = require('nunjucks');
// const userService = require('../service/user-service.js');
const adminService = require('../../services/admin-service.js');
const { log } = require('../../helpers.js');
const dto = require('../../lib/DTO/index.js');
const { tmpl } = require('../../lib/Renderer/index.js');

const cached = new Map();
const cachedHTML = new Map();
// const cachedSupCabList = new Map();
// nunjucks.configure(__VIEWS(), { autoescape: true });

// Handlers
class reportsControllers {
    async index() {
        // const clinics = await adminService.clinics();
        // const render = nunjucks.render('reports/index.html', {foo: 'bar'}) // tmpl.process({foo: 'bar'}, '/reports/index.html')
        const render = tmpl.process({ report: 'index' }, 'reports/index.html');
        return dto.stream(render);
    }

    async clinics() {
        const clinics = await adminService.clinics();
        const render = tmpl.process({ clinics: clinics }, 'reports/index.html');
        return dto.stream(render);
    }

    async clinicById(client) {
        // return DTOFactory({ stream: 'clinic' });
        let render = null;
        const id = client.par.value;

        // log(cached.size);

        if (cached.has(`clinicById(${id})`)) {
            console.time('cached-clinicHTML');
            const clinics = cached.get(`clinicById(${id})`);
            if (cachedHTML.has(`clinicById(${id})`)) {
                render = cachedHTML.get(`clinicById(${id})`)
                // stream = promise(render);
            } else {
                render = nunjucks.render('reports/index.html', { clinics: clinics });
                cachedHTML.set(`clinicById(${id})`, render);
                // stream = promise(render);
            }
            console.timeEnd('cached-clinicHTML');
            // log({ 'cachedHTML.size':cachedHTML.size })

            // cached.set(`clinicById(${id})`, clinics);
        } else {
            console.time('clinicById');
            // log('-')
            // return DTOFactory({ stream: 'clinic 2' });

            const clinics = await adminService.clinicById(id);

            if (!cached.has(`clinicById(${id})`)) {
                cached.set(`clinicById(${id})`, clinics);
            }

            render = nunjucks.render('reports/index.html', { clinics: clinics });

            console.timeEnd('clinicById');
        }

        return dto.stream(render);
    }

    async dubb() {
        const clinicList = [
            { id: 62, name: 'ГБУЗ "НИИ-ККБ№1 им.проф.С.В.Очаповского" г.Краснодар', reg_time: '2019-07-08 23:40:48' },
            { id: 68, name:	'ГКБ 52', reg_time: '2019-08-28 15:37:39' },
            { id: 64, name:	'Клиника МОНИКИ', reg_time: '2019-07-08 23:48:39' },
            { id: 73, name:	'Красноярская краевая больница', reg_time: '2020-10-29 11:46:42' },
            { id: 69, name:	'НИИ им. Алмазова', reg_time: '2020-01-15 10:52:24' },
            { id: 72, name:	'Российская детская клиническая больница им. Н.И. Пирогова', reg_time: '2020-04-15 11:12:16' },
            { id: 71, name:	'Самарский государственный медицинский университет', reg_time: '2020-02-06 14:15:49' },
            { id: 67, name:	'ФГБУ ФКЦ ВМТ ФМБА России', reg_time: '2019-08-11 13:17:39' },
            { id: 63, name:	'ФНЦ трансплантологии им ВИ Шумакова', reg_time: '2019-07-08 23:43:38' },
            { id: 74, name:	'Хабаровское отделение нефрологии', reg_time: '2020-10-29 11:47:49' },
            { id: 70, name:	'Центр трансплантации печени Института Склифосовского', reg_time: '2020-02-05 10:09:41' }
        ];

        return clinicList;
    }

    async stat(client) {
        const list = await adminService.stat('2022-02-09 00:00:00', '2022-02-09 00:00:00');
        log(list)
        return dto.stream(JSON.stringify(list))
    }

    async supCabList() {
        const inactiveAccountDays__ = await adminService.inactiveAccountDays();
        // log({ inactiveAccountDays__ })
        const inactive_account_days = inactiveAccountDays__[0].inactive_account_days;
        // log({ inactive_account_days })
        const inactive_account_days__ = (inactive_account_days) ? inactive_account_days : 10;
        // log(inactive_account_days__)
        const cabList__ = await adminService.cabList();
        // log({ cabList__ })
        let cab_id = 0;
        let name = '';

        // cabList__.forEach(async item => {
        //     cab_id = item.id;
        //     name = item.name;
        //     const admList = await adminService.admList(inactive_account_days__, cab_id);
        //     const docList = await adminService.docList(inactive_account_days, cab_id);
        //     const patSnt = await adminService.patSnt(cab_id);
        //     result__.push({clinic: {id: cab_id, name: name, pat_cnt: patSnt}, admins: admList, docs: docList})
        //     log({ result__ })
        //
        //     // log({ admList })
        //     // log({ docList })
        //     // log({ patSnt })
        //     // log({ item })
        // });

        ;const y = (async () => {
            try {
                let result__ = [];

                cabList__.forEach(async item => {
                    cab_id = item.id;
                    name = item.name;
                    const admList = await adminService.admList(inactive_account_days__, cab_id);
                    const docList = await adminService.docList(inactive_account_days, cab_id);
                    const patSnt = await adminService.patSnt(cab_id);
                    result__.push({clinic: {id: cab_id, name: name, pat_cnt: patSnt}, admins: admList, docs: docList})
                });

                return result__;
            } catch (e) {
                throw e
            } finally {
                // log('finally')
            }
        })();

        const inactiveAccountDays = adminService.inactiveAccountDays();
        const result = inactiveAccountDays.then(data => {
            const res = data[0];
            const inactive_account_days = (res.inactive_account_days) ? res.inactive_account_days : 10;
            const cabList = adminService.cabList();
            return cabList.then(data => {
                let res = [];
                data.forEach(item => {
                    const cab_id = item.id;
                    const name = item.name;
                    const admList = adminService.admList(inactive_account_days, cab_id);
                    const docList = adminService.docList(inactive_account_days, cab_id);
                    const patSnt = adminService.patSnt(cab_id);
                    const promiseList = [admList, docList, patSnt];
                    const promiseAll = Promise.all(promiseList).then(values => values);
                    const promiseRes = promiseAll.then(data => {
                        const admins = data[0];
                        const docs = data[1];
                        const pat_cnt = data[2][0].count;
                        return {clinic: {id: cab_id, name: name, pat_cnt: pat_cnt}, admins: admins, docs: docs};
                    });
                    res.push(promiseRes);
                });
                return res;
            });
        });

        const res = result.then(mdata => {
            const promiseAll = Promise.all(mdata).then(values => values);
            return promiseAll.then(data => {
                let clinicArr = []
                data.forEach(item => {
                    let clinic = item.clinic;
                    clinic.admins = item.admins;
                    clinic.docs = item.docs;
                    clinicArr.push(clinic)
                })
                const render = tmpl.process({ clinics: clinicArr }, 'reports/index.html')
                return dto.stream(render);
            });
        });

        return res;
    }

    async addUser(client) {
        const data = await adminService.addUser(client);
        return dto.stream(data);
    }
}

const reportsController = new reportsControllers();

module.exports = reportsController;