const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'SaltyChi123',
    host: 'localhost',
    port: '5432',
    database: 'tasks'
})

module.exports = pool;