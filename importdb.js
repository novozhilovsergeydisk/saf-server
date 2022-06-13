'use strict'

console.log('script start')

const dotenv = require('dotenv')
dotenv.config()

const { Pool } = require('pg');
const pool = new Pool();

pool.query('SELECT NOW()', (err, res) => {
    // console.log({ err })
    const rows = res.rows
    console.log({ rows })
    pool.end()
})

