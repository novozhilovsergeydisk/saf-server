'use strict';

/*
  Char codes:
    '!': 33 - !
    '#': 35 - %23
    '$': 36 - %24
    '%': 37 - %25
    '&': 38 - %26
    ''': 39 - '
    '(': 40 - (
    ')': 41 - )
    '*': 42 - *
    '+': 43 - %2B
    ',': 44 - %2C
    '-': 45 - -
    '.': 46 - .
    '/': 47 - %2F
    ':': 58 - %3A
    ';': 59 - %3B
    '=': 61 - %3D
    '?': 63 - %3F
    '@': 64 - %40
    '_': 95 - _
    '~': 126 - ~
*/

const { log } = require('./server/helpers.js');
const saf = require('./server/http-server');

const HOST_NAME = '127.0.0.1';
const PORT = 3001;

saf.listen(PORT, HOST_NAME);

// CommonJs
// const saf = require('saf')({
//     logger: true
// })

// const Route = require('./routes.js');

// saf.register(require('./our-first-route'))

// saf.listen(3001, function (err, address) {
//     if (err) {
//         console.log({ error })
//         process.exit(1)
//     }
//     console.log(`Server is now listening on ${address}`)
// })
