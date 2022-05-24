'use strict';
const { faker } = require('@faker-js/faker');

const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const xlsx = require('xlsx');
const {log, query, __SERVER, __UPLOAD} = require('../../helpers.js');
const dto = require(__SERVER() + '/lib/DTO/index.js');
const { tmpl } = require(__SERVER() + '/lib/Renderer/index.js');
const { Pool } = require('pg');
const pool = new Pool();

// const cached = new Map();
// const cachedHTML = new Map();

// Handlers
class UploadControllers {
    async index() {
        const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        return dto.stream(render);
    }

    async

    async saveClients(client) {
        const file = __UPLOAD() + '/clients.xls';
        try {
            const book = xlsx.readFileSync(file);
            let result = {};
            let sheetNumber = 0;
            let sheetList = {};
            let error = false;
            book.SheetNames.forEach(function(name){
                const sheetNames = book.SheetNames;
                log({ sheetNames })
                // Получить текущий объект страницы листа
                sheetNumber++;
                let sheet = book.Sheets[name],
                    range = xlsx.utils.decode_range(sheet['!ref']),
                    row_start = range.s.r, row_end = range.e.r,
                    col_start = range.s.c, col_end = range.e.c,
                    rows = [], row_data, i, addr, cell;
                sheetList[sheetNumber] = sheet;
                log({ sheetNumber })
                if (sheetNumber === 1) {
                    for(;row_start<=row_end;row_start++) {
                        row_data = [];
                        if (row_start > 0) {
                            for(i=col_start;i<=col_end;i++) {
                                addr = xlsx.utils.encode_col(i) + xlsx.utils.encode_row(row_start);
                                cell = sheet[addr];
                                if (typeof cell === 'object') {
                                    row_data.push(cell.v);
                                }
                                if (typeof cell === 'undefined') {
                                    row_data.push('');
                                }
                            }
                            rows.push(row_data);
                        }
                    }
                    let index = 0;
                    // let res = null;
                    rows.forEach(item => {
                        if (index < 190) {
                            pool.connect((err, client, release) => {
                                if (err) {
                                    return console.error('Error acquiring client', err.stack)
                                }
                                const schema = process.env.PGSCHEMA;
                                const id = `nextval('${schema}.clients_id_seq')`;
                                const text = `INSERT INTO ${schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
                                const values = [item[0], item[1], item[2]];
                                client.query(text, values, (err, result) => {
                                    release()
                                    if (err) {
                                        return console.error('Error executing query', err.stack)
                                    }
                                    // log({ i })
                                    console.log(result.rows)
                                })
                            })
                        }

                        // pool.connect((err, client, release) => {
                        //     if (err) {
                        //         return console.error('Error acquiring client', err.stack)
                        //     }
                        //
                        //     // log({ i })
                        //     const id = `nextval('$schema}.clients_id_seq')`;
                        //     const text = `INSERT INTO ${schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
                        //     // log({ text })
                        //
                        //     // const randomName = faker.name.findName(); // Rowan Nikolaus
                        //     // const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
                        //     // const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233
                        //     // const values = [randomName, randomPhoneNumber , randomEmail];
                        //
                        //     const values = [item[0], item[1], item[2]];
                        //
                        //     client.query(text, values, (err, result) => {
                        //         release()
                        //         if (err) {
                        //             return console.error('Error executing query', err.stack)
                        //         }
                        //         log({ i })
                        //         console.log(result.rows)
                        //     })
                        //
                        //     // client.query('SELECT NOW()', (err, result) => {
                        //     //     release()
                        //     //     if (err) {
                        //     //         return console.error('Error executing query', err.stack)
                        //     //     }
                        //     //     log({ i })
                        //     //     console.log(result.rows)
                        //     // })
                        //
                        //     // client.query('SELECT NOW()', (err, result) => {
                        //     //     release()
                        //     //     if (err) {
                        //     //         return console.error('Error executing query', err.stack)
                        //     //     }
                        //     //     console.log(result.rows)
                        //     // })
                        // })

                        // const id = `nextval('${schema}.clients_id_seq')`;
                        // const text = `INSERT INTO ${schema}.clients VALUES(${id}, $1, $2, $3) RETURNING *`;
                        // // log({ text })
                        //
                        // const randomName = faker.name.findName(); // Rowan Nikolaus
                        // const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
                        // const randomPhoneNumber = faker.phone.phoneNumber(); // (279) 329-8663 x30233
                        // const values = [randomName, randomPhoneNumber , randomEmail];
                        // const values = [item[0], item[1], item[2]];
                        // log({ values })

                        // res = query(text, values);
                        // res
                        //     .then(data => {
                        //         // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
                        //         // client.res.writeHead(200, { 'Connection': 'close' });
                        //         // client.res.write(text);
                        //         // client.res.setHeader('Content-Text' + String(index), text);
                        //         // log({ data })
                        //     })
                        //     .catch(err => {
                        //         // log({ index })
                        //         // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
                        //         // client.res.writeHead(500, { 'Connection': 'close' });
                        //         // client.res.write(err);
                        //         // client.res.setHeader('Content-Error' + String(index), err);
                        //         error = true
                        //         // log('id ' + String(id))
                        //         // log({ text })
                        //         log({ values })
                        //         log({ err })
                        //
                        //         log('--------------------------------------------------------------')
                        //         // return;
                        //     })
                        //
                        // log({ res })
                        index++;
                    });
                    // log({ index })
                    result[name] = rows;
                }
            });

            // client.res.writeHead(200, { 'Connection': 'close' });

            // client.res.setHeader('Content-Type', 'text/html; charset=utf8');
            // client.res.writeHead(200, { 'Connection': 'close' });
            client.res.writeHeader(200, {'Content-Type': 'text/html; charset=utf8', 'Error': error, 'Connection': 'close', });
            client.res.end(`uploadClients`);
            return result;
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
        }
        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);
    }

    async upload(client) {
        // log({ client })

        try {
            const bb = busboy({ headers: client.req.headers });
            bb.on('file', (name, file, info) => {
                // console.log({ info })
                const filename = info.filename;
                console.log({ filename })
                client.res.setHeader('File-Upload', filename);
                try {
                    const saveTo = path.join(__UPLOAD(), filename);
                    // const saveTo = path.join(os.tmpdir(), `saf-server/${random()}`);
                    // console.log({ file })
                    // file.pipe(process.stdout)
                    console.log({ saveTo })
                    // console.log(os.tmpdir())
                    file.pipe(fs.createWriteStream(saveTo));
                } catch(err) {
                    console.log({ err })
                }
            });

            bb.on('field', (name, val, info) => {
                // console.log({ info })
                console.log(`Field [${name}]: value: %j`, val);
                // params.set(name, val);
                client.res.setHeader(`Field-${name}`, `${val}`);
            });

            bb.on('close', () => {
                client.res.setHeader('Info-Status', true);
                client.res.writeHead(200, { 'Connection': 'close' });
                client.res.end(`Файл успешно загружен на сервер` );
                // return `That's all folks!!!`;
                // res.writeHead(200, { 'Connection': 'close' });
                // res.end(`That's all folks!!!`);
            });
            client.req.pipe(bb);
            return;
        } catch(err) {
            console.log({ err })
            client.res.writeHead(500, { 'Connection': 'close' });
            client.res.end(`${err}`);
            // return {foo:'bar'}
        }

        // const render = tmpl.process({ title: 'upload', description: 'upload' }, 'upload/index.html');
        // return dto.stream(render);

    }
}

const uploadController = new UploadControllers();

module.exports = { uploadController };
