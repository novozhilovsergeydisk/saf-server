'use strict';

const { Pool } = require('pg');
const { log, start, end } = require('../helpers');

const where = (conditions) => {
    let clause = '';
    const args = [];
    let i = 1;
    for (const key in conditions) {
        let value = conditions[key];
        let condition;
        if (typeof value === 'number') {
            condition = `${key} = $${i}`;
        } else if (typeof value === 'string') {
            if (value.startsWith('>=')) {
                condition = `${key} >= $${i}`;
                value = value.substring(2);
            } else if (value.startsWith('<=')) {
                condition = `${key} <= $${i}`;
                value = value.substring(2);
            } else if (value.startsWith('<>')) {
                condition = `${key} <> $${i}`;
                value = value.substring(2);
            } else if (value.startsWith('>')) {
                condition = `${key} > $${i}`;
                value = value.substring(1);
            } else if (value.startsWith('<')) {
                condition = `${key} < $${i}`;
                value = value.substring(1);
            } else if (value.includes('*') || value.includes('?')) {
                value = value.replace(/\*/g, '%').replace(/\?/g, '_');
                condition = `${key} LIKE $${i}`;
            } else {
                condition = `${key} = $${i}`;
            }
        }
        i++;
        args.push(value);
        clause = clause ? `${clause} AND ${condition}` : condition;
    }

    return { clause, args };
};

const MODE_ROWS = 0;
const MODE_VALUE = 1;
const MODE_ROW = 2;
const MODE_COL = 3;
const MODE_COUNT = 4;

class Cursor {
    constructor(database, table) {
        this.database = database;
        this.table = table;
        this.cols = null;
        this.rows = null;
        this.rowCount = 0;
        this.ready = false;
        this.mode = MODE_ROWS;
        this.whereClause = undefined;
        this.columns = ['*'];
        this.args = [];
        this.orderBy = undefined;
        this.sql = '';
    }

    resolve(result) {
        try {
            const { rows, fields, rowCount } = result;
            this.rows = rows;
            this.cols = fields;
            this.rowCount = rowCount;
        } catch(e) {
            //throw new Error('Error connect db');


            // log({ 'error resolve(result)': e });
            this.rows = 0;
            this.cols = 0;
            this.rowCount = 0;

            return { 'error': e };
        }
    }

    where(conditions) {
        const { clause, args } = where(conditions);
        this.whereClause = clause;
        this.args = args;
        return this;
    }

    fields(list) {
        this.columns = list;
        return this;
    }

    value() {
        this.mode = MODE_VALUE;
        return this;
    }

    row() {
        this.mode = MODE_ROW;
        return this;
    }

    col(name) {
        this.mode = MODE_COL;
        this.columnName = name;
        return this;
    }

    count() {
        this.mode = MODE_COUNT;
        return this;
    }

    order(name) {
        this.orderBy = name;
        return this;
    }

    then(callback) {

        // log( callback );

        // TODO: store callback to pool
        const { mode, table, columns, args } = this;
        const { whereClause, orderBy, columnName } = this;
        const fields = columns.join(', ');
        let sql = `SELECT ${fields} FROM ${table}`;
        if (whereClause) sql += ` WHERE ${whereClause}`;
        if (orderBy) sql += ` ORDER BY ${orderBy}`;

        this.database.query(sql, args,  (err, res) => {
            start();
            log({ sql, args, callback });
            end();

            // if (err) {
            //     console.log({ 'sql': sql, 'err': err.message });
            //     return err;
            // }

            this.resolve(res);

            const { rows, cols } = this;
            if (mode === MODE_VALUE) {
                const col = cols[0];
                const row = rows[0];
                callback(row[col.name]);
            } else if (mode === MODE_ROW) {
                callback(rows[0]);
            } else if (mode === MODE_COL) {
                const col = [];
                for (const row of rows) {
                    col.push(row[columnName]);
                }
                callback(col);
            } else if (mode === MODE_COUNT) {
                callback(this.rowCount);
            } else {
                callback(rows);
            }
        });

        return this;
    }
}

class Database {
    constructor(config, logger) {
        this.pool = new Pool(config);
        this.config = config;
        this.logger = logger;
    }

    query(sql, values, callback) {
        if (typeof values === 'function') {
            callback = values;
            values = [];
        }
        const startTime = new Date().getTime();

        // log({ callback });

        this.pool.query(sql, values, (err, res) => {
            // start();
            // log('Database: this.pool.query');
            // log({ sql, values, callback });

            // log({ 'cb': callback(err, res) });

            // if (err) {
            //     log({ err });
            //
            //     return err.message;
            // }

            const endTime = new Date().getTime();
            const executionTime = endTime - startTime;
            console.log(`Execution time: ${executionTime} ms`);
            // console.log(this.Client);

            if (callback) callback(err, res);

            // end();
        });
    }

    select(table) {
        return new Cursor(this, table);
    }

    close() {
        this.pool.end();
    }
}

module.exports = {
    open: (config, logger) => new Database(config, logger),
};

// const { Pool } = require('pg');
//
// // 'SELECT $1::text as name', ['transplant.net']
// class DB {
//     constructor() {
//         this.pool = new Pool({
//             user: 'postgres',
//             host: 'localhost',
//             database: 'transplant_net_ru',
//             password: 'postgres_12345',
//             port: 5432,
//         });
//     }
//
//     query(sql, params=null) {
//         const pool = new Pool({
//             user: 'postgres',
//             host: 'localhost',
//             database: 'transplant_net_ru',
//             password: 'postgres_12345',
//             port: 5432,
//         });
//         const promice = new Promise((resolve, reject) => {
//             pool
//                 .query(sql, params)
//                 .then(res => {
//                     resolve({ 'result': res.rows, 'error': null });
//                 })
//                 .catch(err => {
//                     reject({ 'result': 'undefined', 'error': err.stack });
//                 });
//         });
//         return promice.then(data => {
//             if (data) console.log(data);
//         }).catch(err => {
//             if (err) console.log({ 'err': err });
//         });
//     }
// }
//
// module.exports = DB;