const db = require(__base + "db/index");


/**
 * insert a user
 * @param {object} newUserData
 * @returns {object} user created
 */
async function insert(newUserData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.users + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
        [new Date(), new Date(), null, newUserData]
    );
    return res.rows[0];
}


/**
 *  * update a user by Google Id
 * @param {int}  project_id
 * @param {object} newProjectData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 *//*
async function updateByGoogleId(google_id, newUserData) {
    let res = await db.query(
        'UPDATE public.' + db.TABLES.users + ' SET "date_last_modified" = $1,  "data" = $2 WHERE data->>\'google_id\' = $3',
        [new Date(), newUserData, google_id]
    );
    return res.rowCount;
}*/

/**
 *  * logout a user by tokenId
 * @param {int}  tokenId
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 *//*
async function logoutByTokenId(tokenId) {

    let res = await db.query(
        'UPDATE public.' + db.TABLES.users + ' SET "date_last_modified" = $1,  "data" = jsonb_set(data, \'{token_id}\' , \'""\', true)  WHERE data->>\'token_id\' = $2',
        [new Date(), tokenId]
    );
    return res.rowCount;
}*/



/**
 * get user by Google Id
 * @param {string} google_id
 * @returns {object} user found
 */
async function getUserByGoogleId(google_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'google_id\' = $1',
        [google_id]
    );

    return res.rows[0];
}

/**
 * get user by email
 * @param {string} user_email
 * @returns {object} user found
 */
async function getUserByEmail(email) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'email\' = $1',
        [email]
    );

    return res.rows[0];
}



/**
 * check user's existence by token Id
 * @param {int} token_id
 * @returns {int} number of row affected , 1 if ok, 0 if not found
 *//*
async function checkUserByTokenId(token_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'token_id\' = $1',
        [token_id]
    );

    return res.rowCount;
}*/

/**
 * get user by tokenId
 * @param {int} token_id
 * @returns {object} user found
 *//*
async function getUserByTokenId(token_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'token_id\' = $1',
        [token_id]
    );
    return res.rows[0];
}*/


module.exports = {
    insert,
    getUserByGoogleId,
    getUserByEmail,
    //checkUserByTokenId,
    //updateByGoogleId,
    //getUserByTokenId,
    //logoutByTokenId
};