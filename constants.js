'use strict';

// const path = require('path');

const views_path = process.env.VIEWS_PATH;

const appPath = process.cwd(); // path.resolve(__dirname);

const MIME_TYPES = {
    html:      'text/html',
    textPlain: 'text/plain',
    js:        'application/javascript',
    json:      'application/json',
    pdf:       'application/pdf',
    xml:       'application/xml',
    msexcel:   'application/vnd.ms-excel',
    css:       'text/css',
    png:       'image/png',
    jpeg:      'image/jpeg',
    jpg:       'image/jpeg',
    ico:       'image/x-icon',
    svg:       'image/svg+xml',
    webp:      'image/webp',
    woff:      'application/x-font-woff',
    woff2:     'application/x-font-woff2',
    ttf:       'application/x-font-ttf',
    otf:       'application/x-font-otf',
    mp3:       'audio/mpeg',
    mp4:       'video/mp4'
};

const ALLOWED_METHODS = ['GET', 'POST', 'PUT'];

const CONSTANTS = {
    MIME_TYPES: MIME_TYPES,
    ALLOWED_METHODS: ALLOWED_METHODS,
    APP_PATH: appPath,
    SERVER_PATH: appPath + '/server',
    SERVICES_PATH: appPath + '/server/services',
    STORAGE_PATH: appPath + '/server/storage',
    UPLOAD_PATH: appPath + '/server/storage/upload',
    RESOURCES_PATH: appPath + '/src',
    VIEWS_PATH: appPath + views_path,
    CONTROLLERS_PATH: appPath + '/controllers/',
    STATIC_PATH: appPath + '/static'
};

module.exports = CONSTANTS;

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
