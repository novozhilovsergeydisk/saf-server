'use strict';

const fs = require('fs');
const path = require('path');
const v8 = require('v8');

const PATH = `${__dirname}/sessions`;

const { log } = require('../../helpers.js')

//console.log({ __dirname });

const safePath = (fn) => (token, ...args) => {



    const callback = args[args.length - 1];
    if (typeof token !== 'string') {
        callback(new Error('Invalid session token'));
        return;
    }
    const fileName = path.join(PATH, token);

    log({ fileName })

    if (!fileName.startsWith(PATH)) {
        callback(new Error('Invalid session token'));
        return;
    }

    log({ fn })

    fs.writeFile(fileName, ...args);
};

const readSession = safePath(fs.readFile);
const writeSession = safePath(fs.writeFile);
const deleteSession = safePath(fs.unlink);

log({ readSession })

class Storage extends Map {
    get(key, callback) {
        const value = super.get(key);
        if (value) {
            callback(null, value);
            return;
        }
        readSession(key, (err, data) => {
            if (err) {
                callback(err);
                return;
            }
            console.log(`Session loaded: ${key}`);
            const session = v8.deserialize(data);
            super.set(key, session);
            callback(null, session);
        });
    }

    save(key) {
        log({ key })

        const value = super.get(key);

        log({ value })

        if (!value) {
            const data = v8.serialize('Joker');
            writeSession(key, data, () => {
                log({ data })
                console.log(`Session saved: ${key}`);
            });
        }
    }

    delete(key) {
        console.log('Delete: ', key);
        deleteSession(key, () => {
            console.log(`Session deleted: ${key}`);
        });
    }
}

module.exports = new Storage();