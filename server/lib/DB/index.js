'use strict';

const { Pool } = require('pg');

const query = (async sql => {
    try {
        const pool = new Pool();
        const result = await pool.query(sql);
        return result;
    } catch(error) {
        console.log(error)
        return error;
    }
})

module.exports = { query };
