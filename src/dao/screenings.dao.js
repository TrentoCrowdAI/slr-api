const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a screening
 * @param {Object} newScreeningData
 * @param {int} user_id
 * @param {int} project_id
 * @returns {Object} screening created
 */

async function insert(newScreeningData, user_id, project_id, ) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.screenings + '("date_created", "date_last_modified", "date_deleted", "data", "user_id", "project_id") VALUES($1,$2,$3, $4, $5, $6) RETURNING *',
        [new Date(), new Date(), null, newScreeningData,user_id,  project_id]
    );

    return res.rows[0];
}




/**
 *  * update a screening
 * @param {int} screening_id
 * @param {Object} newScreeningData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(screening_id, newScreeningData) {


    let res = await db.query(
        'UPDATE public.' + db.TABLES.screenings + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
        [new Date(), newScreeningData, screening_id]
    );

    return res.rowCount;
}


/**
 *  * delete a screening
 * @param {int} screening_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */

async function deletes(screening_id) {

    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.screenings + ' WHERE id = $1',
        [screening_id]
    );

    return res.rowCount;
}

/**
 * select a screening
 * @param {int} screening_id
 * @returns {Object} screening found
 */

async function selectById(screening_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.screenings + ' WHERE id = $1',
        [screening_id]
    );

    return res.rows[0];
}


/**
 * select the screenings by user id
 * @param {int} user_id
 * @returns {array[]} the list of screening found
 */

async function selectByUserId(user_id) {
    let res = await db.query(
        "SELECT * FROM public.' + db.TABLES.screenings + ' WHERE user_id = $1",
        [user_id]
    );

    return res.rows;
}





/**
 * select the screenings by project id
 * @param {int} project_id
 * @returns {array[]} the list of screening found
 */

async function selectByProjectId(project_id) {
    let res = await db.query(
        "SELECT * FROM public.' + db.TABLES.screenings + ' WHERE project_id = $1",
        [project_id]
    );

    return res.rows;
}





module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectByUserId,
    selectByProjectId,

};