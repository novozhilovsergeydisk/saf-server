'use strict'

const fs = require('fs')
const dto = require('../../lib/DTO/index.js')
const {statPath, __STATIC} = require('../../helpers.js')

class File {
    async getContent(client) {
        const url = client.url
        let data = null
        const stats = statPath(__STATIC(url))
        // if (stats && !stats.isDirectory()) {
        //     return fs.realpathSync(requestPath, Module._realpathCache);
        // }
        if(stats && stats.isFile()) {
            data = fs.createReadStream(__STATIC(url))
        }
        return dto.stream(data) //DTOFactory({ stream: stream });
    }

    serve(client) {
        const { name } = client;
        const filePath = path.join(STATIC_PATH, name);
        return Promise.resolve()
            .then(() => {
                return this.exists(filePath)
            })
            .then(result => {
                if (result.status === 'success') {
                    client.file = filePath;
                    result.stream = this.stream(client);
                }
                if (result.status === 'failed') {
                    result.stream = null;
                    return result;
                }
                // log({ 'serve()': result });
                return result;
            })
            .catch(err => {
                console.log({ 'Error while streaming process': err });
            });
    }

    stream(client) {
        const { file } = client;
        // log({ ' stream(file)': file });

        const promiseStream = new Promise((resolve, reject) => {
            fs.stat(file, (error) => {
                if (error) {
                    const error_stream = 'No resource file: ' + client.req.url;
                    reject(error_stream);
                }
                else {
                    const stream = fs.createReadStream(file);
                    // log(`Served resource file and resolve promise: ${name}`);
                    // log(`\n-------------------------------\n`);
                    resolve(stream);
                }
            });
        });

        return promiseStream;
    }

    exists(file) {
        const prom = new Promise((resolve, reject) => {
            fs.stat(file, function(err, stats) {
                if (err) {
                    reject('File not found');
                } else {
                    resolve(stats);
                }
            });
        });

        return prom.then(stats => {
            return new Promise(resolve => {
                stats._file = file;

                // const dto = DTOFactory({
                //     status: 'success',
                //     data: { 'file': file },
                // });

                // log({ dto });
                // resolve(dto);

                resolve({ state: 'read file', info: 'file ' + file, status: 'success', error: '' });
            });
        }).catch(err => {
            return new Promise(reject => {
                reject({ state: 'read file', info: 'file ' + file, status: 'failed', error: err });
            });
        });
    }
}

const file = new File()
module.exports = file.getContent