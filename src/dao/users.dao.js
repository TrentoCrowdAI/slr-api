const db = require(__base + "db/index");


/**
 * insert a user
 * @param {Object} newUserData
 * @returns {Object} user created
 */
async function insert(newUserData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.users + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
        [new Date(), new Date(), null, newUserData]
    );
    return res.rows[0];
}

/**
 * update a user by email
 * @param {Object} newUserData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(newUserData) {
    res = await db.query(
        'UPDATE public.' + db.TABLES.users + ' SET "date_last_modified" = $1,  "data" = $2 WHERE data->>\'email\' = $3',
        [new Date(), newUserData, newUserData.email]
    );
    return res.rowCount;
}


/**
 * get user by email
 * @param {string} user_email
 * @returns {Object} user found
 */
async function getUserByEmail(email) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.users + ' WHERE data->>\'email\' = $1',
        [email]
    );

    return res.rows[0];
}

/**
 * get users list by array of ids
 * @param {string} arrayIds
 * @returns {Object[]} list of users found
 */
async function getUserByArrayIds(arrayIds) {
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.users + "  WHERE id IN("+arrayIds.toString()+") "
    );

    return res.rows;
}

/**
 * get user by id
 * @param {int} id
 * @returns {Object} users found
 */
async function getUserById(id) {
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.users + "  WHERE id = $1",
        [id]
    );

    return res.rows[0];
}



module.exports = {
    insert,
    update,
    getUserByEmail,
    getUserByArrayIds,
    getUserById,
};