const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const proConfig = process.env.DATABASE_URL; //heroku addons

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? proConfig : devConfig,

<<<<<<< HEAD
  //ssl: { rejectUnauthorized: false },
=======
  // ssl: { rejectUnauthorized: false },
>>>>>>> 1a738f56aca87e37c0b3dce44e6bc71a63e4e7dc
});

module.exports = pool;
