const db = require('./lib/DB');
const pg = db.open( conf.database );

// const connect = ((id) => {
//     return new Promise((resolve) => {
//         const sql = 'cabinet c';
//         pg
//             .select(sql)
//             .where({'id': `${id}`})
//             // .fields(['u.id, u.email'])
//             // order
//             .then(result => {
//                 // log({ 'typeof result': typeof result });
//                 // log({ result });
//                 // resolve(DTOFactory({ stream: result }));
//
//                 resolve( result );
//             });
//     });
// });
//
// const testData = connect(59);


// log({ testData });

// const sql = 'SELECT NOW() as now';
// const client_pg = new Client();
// client_pg.connect();

// promise
// client_pg
//     .query(sql)
//     .then(res => {
//         console.log(res.fields.map(field => field.name));
//         console.log(res.rows[0]);
//         console.log( res.rows );
//     })
//     .catch(e => console.error(e.stack));

// clients will also use environment variables
// for connection information
// const sql = 'SELECT NOW()';
// const connect = (async (sql) => {
//     try {
//         const client_pg = new Client();
//         await client_pg.connect();
//         process.env.PG_CONNECTION = true;
//         const res = await client_pg.query(sql);
//         console.log(res.rows);
//         await client_pg.end();
//         // log({ 'connection': process.env.PG_CONNECTION });
//     } catch(e) {
//         process.env.PG_CONNECTION = false;
//         // log({ 'connection': process.env.PG_CONNECTION });
//         console.log(e.message);
//     }
// });
//
// log(connect(sql));

// const fs = require('fs');
// const mime = require('mime');
// const url = require('url');
// const model = require('./lib/Model.js');
// const { logger, asyncLocalStorage } = require('./lib/Logger');
// log( conf.mailer_config );

// var faker = require('faker');
// const randomName = faker.name.findName(); // Rowan Nikolaus
// const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
// const randomCard = faker.helpers.createCard(); // random contact card containing many properties
// const randomImage = faker.image.fashion();

//log({ randomName, randomEmail, randomImage });

// Вы можете использовать промисы в своих асинхронных функциях, возвращая промис из функции и помещая код функции в обратный вызов промиса.
// Если есть ошибка, reject с объектом Error. В противном случае resolve промис с результатом, чтобы оно было доступно в цепочке метода .then
// или непосредственно в качестве значения функции async при использовании async/await.

function test(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof num !== 'number') {
                //reject('error');
                reject(new TypeError(`Expected number but got: ${typeof num}`));
            }

            const result = num * num;
            resolve(result);
        }, 1000);
    });
}

test(79)
    .then((result) => console.log(result))
    .catch((err) => console.error(err));

------------------------------------------------------------------------------------------------------------------------

