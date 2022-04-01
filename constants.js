const path = require('path');
const { views_name } = require('./server/conf.js');

// console.log({ views_path });

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

// var idx = array.indexOf(element);

const ALLOWED_METHODS = ['GET', 'POST', 'PUT'];

// let test = ALLOWED_METHODS.indexOf('PUT');
// console.log({test })
// test = ALLOWED_METHODS.indexOf('PATCH');
// console.log({test })

// const HTTPMethod = {
//     'ACL': false,
//     'BIND': false,
//     'CHECKOUT': false,
//     'CONNECT': false,
//     'COPY': false,
//     'DELETE': false,
//     'GET': false,
//     'HEAD': false,
//     'LINK': false,
//     'LOCK': false,
//     'M-SEARCH': false,
//     'MERGE': false,
//     'MKACTIVITY': false,
//     'MKCALENDAR': false,
//     'MKCOL': false,
//     'MOVE': false,
//     'NOTIFY': false,
//     'OPTIONS': false,
//     'PATCH': false,
//     'POST': false,
//     'PROPFIND': false,
//     'PROPPATCH': false,
//     'PURGE': false,
//     'PUT': false,
//     'REBIND': false,
//     'REPORT': false,
//     'SEARCH': false,
//     'SOURCE': false,
//     'SUBSCRIBE': false,
//     'TRACE': false,
//     'UNBIND': false,
//     'UNLINK': false,
//     'UNLOCK': false,
//     'UNSUBSCRIBE' : false
// };

const appPath = path.resolve(__dirname);

// console.log(appPath);

const CONSTANTS = {
    MIME_TYPES: MIME_TYPES,
    APP_PATH: appPath,
    SERVER_PATH: appPath + '/server',
    RESOURCES_PATH: appPath + '/src',
    VIEWS_PATH: appPath + views_name,
    CONTROLLERS_PATH: appPath + '/controllers/',
    STATIC_PATH: path.join(appPath, './static'),
    ALLOWED_METHODS: ALLOWED_METHODS
};

module.exports = CONSTANTS;
