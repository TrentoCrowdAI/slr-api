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
 */
async function updateByGoogleId(google_id, newUserData) {
    let res = await db.query(
        'UPDATE public.' + db.TABLES.projects + ' SET "date_last_modified" = $1,  "data" = $2 WHERE data->>\'sub\' = $3',
        [new Date(), newUserData, google_id]
    );
    return res.rowCount;
}


/**
 * check user's existence by Google Id
 * @param {int} google_id
 * @returns {boolean} true if found, false if not found
 */
async function checkUserByGoogleId(google_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'sub\' = $1',
        [google_id]
    );

    let flag = false;
    if(res.rowCount > 0){
        flag = true;
    }

    return flag;
}



/**
 * check user's existence by token Id
 * @param {int} token_id
 * @returns {boolean} true if found, false if not found
 */
async function checkUserByTokenId(token_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'token_id\' = $1',
        [token_id]
    );

    let flag = false;
    if(res.rowCount > 0){
        flag = true;
    }

    return flag;
}


module.exports = {
    insert,
    checkUserByGoogleId,
    checkUserByTokenId,
    updateByGoogleId,

};