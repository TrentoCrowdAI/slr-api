const {Pool} = require('pg');
const promiseRetry = require('promise-retry');
const config = require(__base + 'config');

/*initial credentials were not used*/
let credentials = {
    database: config.db.database,
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password
};

/* if a db URL is provided, we use it to connect the database.*/
if (config.db.url)
{
    credentials = {
        connectionString: config.db.url,
        ssl: true,
    };
}
/*create new pool of connections*/
const pool = new Pool(credentials);


/*is need to catch the possibily error generate by client of pool, 
the client will be automatically terminated end removed from the pool
 see https://node-postgres.com/api/pool#-code-pool-on-39-error-39-err-error-client-client-gt-void-gt-void-code-
*/
pool.on('error', (error, client) => {
    console.debug('[pool.on.error]', error.message);
});



/**
 * Query wrapper to not use pg directly.
 *
 * @param {string} text string sql
 * @param {any[]} params to insert into sql
 */
const query = (text, params) => {
    //retries the pool.query for 15 times with timeout random
    return promiseRetry({retries: 15, randomize: true}, (retry, attempt) => {
        return pool.query(text, params).catch(err => {
            if (err.code === 'ECONNREFUSED')
            {
                console.log(`retrying query, attempt #${attempt}`);
                //retry pool.query
                return retry(err);
            }
            else
            {
                return Promise.reject(err);
            }
        });
    });
};

/**
 *  version haven't parameter
 * @param {string} text string sql
 */
const queryNotParameter = (text) => {
    //retries the pool.query for 15 times with timeout random
    return promiseRetry({retries: 15, randomize: true}, (retry, attempt) => {
        return pool.query(text).catch(err => {
            if (err.code === 'ECONNREFUSED')
            {
                console.log(`retrying query, attempt #${attempt}`);
                //retry pool.query
                return retry(err);
            }
            else
            {
                return Promise.reject(err);
            }
        });
    });
};


/*the function to close pool wrapper.*/
const end = () => pool.end();


/*object that contains all table names*/
const TABLES = config.db_tables;


module.exports = {
    TABLES,
    query,
    queryNotParameter,
    end
};
