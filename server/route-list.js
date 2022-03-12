'use strict';

const {mainController} = require('./controllers/main/index.js');
const {getContent} = require('./lib/File/index.js');

const routing = {
    'GET': {
        '/': mainController.index,
        '/css/*': getContent,
        '/js/*': getContent,
        '/img/*': getContent,
        '/fonts/*': getContent,
        '/webfonts/*': getContent,
        '/favicon.ico': getContent,
        '/robots.txt': getContent,
        '/sitemap.xml': getContent,
    },
    'POST': {

    }
};

module.exports = routing;

