module.exports = {
  db: {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // heroku postgres adds automatically the following variable.
    url: process.env.DATABASE_URL
  }
};
