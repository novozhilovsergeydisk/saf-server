const fs = require('fs');
const { log, statPath, __STATIC, __VIEWS, __APP, __SERVER } = require('../../helpers.js');
const nunjucks = require('nunjucks');
const dto = require(__SERVER + '/../lib/DTO/index.js');
const { tmpl } = require(__SERVER + '/lib/Renderer/index.js');

nunjucks.configure(__VIEWS(), { autoescape: true });

// const cached = new Map();
// const cachedHTML = new Map();

// Handlers
class UploadControllers {
    // async index() {
    //     // if (cached.has(`clinicById(${id})`)) {
    //     //     console.time('cached-clinicHTML');
    //     //     const clinics = cached.get(`clinicById(${id})`);
    //     //     if (cachedHTML.has(`clinicById(${id})`)) {
    //     //         render = cachedHTML.get(`clinicById(${id})`)
    //     //         // stream = promise(render);
    //     //     } else {
    //     //         render = nunjucks.render('reports/index.html', { clinics: clinics });
    //     //         cachedHTML.set(`clinicById(${id})`, render);
    //     //         // stream = promise(render);
    //     //     }
    //     //     console.timeEnd('cached-clinicHTML');
    //     //     // log({ 'cachedHTML.size':cachedHTML.size })
    //     //
    //     //     // cached.set(`clinicById(${id})`, clinics);
    //     // } else {
    //     //     console.time('clinicById');
    //     //     // log('-')
    //     //     // return DTOFactory({ stream: 'clinic 2' });
    //     //
    //     //     const clinics = await adminService.clinicById(id);
    //     //
    //     //     if (!cached.has(`clinicById(${id})`)) {
    //     //         cached.set(`clinicById(${id})`, clinics);
    //     //     }
    //     //
    //     //     render = nunjucks.render('reports/index.html', { clinics: clinics });
    //     //
    //     //     console.timeEnd('clinicById');
    //     // }
    //
    //     const render = tmpl.process({ title: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.', description: 'Roma' }, 'main/index.html');
    //     return dto.stream(render);
    //
    // }

    async upload() {

        const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        return dto.stream(render);

    }
}

const uploadController = new UploadControllers();

module.exports = { uploadController };
