const path = require('path');
const { views_name } = require('./server/conf.js');

const MIME_TYPES = {
    html:    'text/html',
    js:      'application/javascript',
    json:    'application/json',
    pdf:     'application/pdf',
    xml:     'application/xml',
    msexcel: 'application/vnd.ms-excel',
    css:     'text/css',
    png:     'image/png',
    jpeg:    'image/jpeg',
    jpg:     'image/jpeg',
    ico:     'image/x-icon',
    svg:     'image/svg+xml',
    webp:    'image/webp',
    woff:    'application/x-font-woff',
    woff2:   'application/x-font-woff2',
    ttf:     'application/x-font-ttf',
    otf:     'application/x-font-otf',
    mp3:     'audio/mpeg',
    mp4:     'video/mp4'
};

const appPath = path.resolve(__dirname);

// console.log({ appPath });
// console.log(appPath + views_name);

const CONSTANTS = {
    MIME_TYPES: MIME_TYPES,
    APP_PATH: appPath,
    SERVER_PATH: appPath + '/server',
    RESOURCES_PATH: appPath + '/src',
    VIEWS_PATH: appPath + views_name,
    CONTROLLERS_PATH: appPath + '/controllers/',
    STATIC_PATH: path.join(appPath, './static')
};

module.exports = CONSTANTS;
