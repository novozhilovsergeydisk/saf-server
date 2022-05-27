const fs = require('fs');
const {removeLastSlash, statPath, __STATIC, query, select} = require('../../helpers.js');
// const nunjucks = require('nunjucks');
const dto = require('../../lib/DTO/index.js');
const {tmpl} = require('../../lib/Renderer/index.js');
// const { select } = require('../../lib/DTO/index.js');
const adminService = require('../../services/admin-service/index.js');

// const text = `SELECT * FROM transplant.clients`;
// const res = query(text);
// log({ res })

const cached = new Map();
const cachedHTML = new Map();

// Handlers
class MainControllers {
    async test() {
        const render = tmpl.process({ title: 'test', description: 'test' }, 'test/index.html');
        return dto.stream(render);
    }

    async parse() {
        const render = tmpl.process({ title: 'parse', description: 'parse' }, 'parse/index.html');
        return dto.stream(render);
    }

    async xslx() {
        const render = tmpl.process({ title: 'test', description: 'test' }, 'xslx/index.html');
        return dto.stream(render);
    }

    async index() {
        const render = tmpl.process({ title: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.', description: 'Roma' }, 'main/index.html');
        return dto.stream(render);
    }

    async upload() {
        // if (cached.has(`clinicById(${id})`)) {
        //     console.time('cached-clinicHTML');
        //     const clinics = cached.get(`clinicById(${id})`);
        //     if (cachedHTML.has(`clinicById(${id})`)) {
        //         render = cachedHTML.get(`clinicById(${id})`)
        //         // stream = promise(render);
        //     } else {
        //         render = nunjucks.render('reports/index.html', { clinics: clinics });
        //         cachedHTML.set(`clinicById(${id})`, render);
        //         // stream = promise(render);
        //     }
        //     console.timeEnd('cached-clinicHTML');
        //     // log({ 'cachedHTML.size':cachedHTML.size })
        //
        //     // cached.set(`clinicById(${id})`, clinics);
        // } else {
        //     console.time('clinicById');
        //     // log('-')
        //     // return DTOFactory({ stream: 'clinic 2' });
        //
        //     const clinics = await adminService.clinicById(id);
        //
        //     if (!cached.has(`clinicById(${id})`)) {
        //         cached.set(`clinicById(${id})`, clinics);
        //     }
        //
        //     render = nunjucks.render('reports/index.html', { clinics: clinics });
        //
        //     console.timeEnd('clinicById');
        // }

        //const render = tmpl.process({ title: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine.', description: 'Roma' }, 'main/index.html');
        return dto.stream('Node.js is a JavaScript runtime...');

    }

    async content(url) {
        let data = null;
        const stats = statPath(__STATIC(url));
        if(stats && stats.isFile()) {
            data = fs.createReadStream(__STATIC(url));
        }
        return data;
    }
}

class StaticControllers {
    async staticContent(client) {
        const url = client.url;
        let data = null;
        const stats = statPath(__STATIC(url));
        // if (stats && !stats.isDirectory()) {
        //     return fs.realpathSync(requestPath, Module._realpathCache);
        // }
        if(stats && stats.isFile()) {
            data = fs.createReadStream(__STATIC(url));
        }
        return dto.stream(data); //DTOFactory({ stream: stream });
    }

    async resContent(url) {
        let data = null;
        const stats = statPath(__STATIC(url));
        if(stats && stats.isFile()) {
            data = fs.createReadStream(__STATIC(url));
        }
        return data;
    }
}

let hello = async () => {
    return "Hello"
};

const getContent = async (url) => {
    url = removeLastSlash('/', url);
    let data = null;
    const stats = statPath(__STATIC(url));
    if(stats && stats.isFile()) {
        data = await fs.createReadStream(__STATIC(url));
    }
    return data;
}

const mainController = new MainControllers();
const staticController = new StaticControllers();

module.exports = { mainController, staticController, getContent };
