const db = require(__base + "db/index");


/**
 * insert a project
 * @param {Object} newProjectData
 * @returns {Object} project created
 */
async function insert(newProjectData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.projects + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
        [new Date(), new Date(), null, newProjectData]
    );
    return res.rows[0];
}


/**
 *  * update a project
 * @param {int}  project_id
 * @param {Object} newProjectData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(project_id, newProjectData) {
    let res = await db.query(
        'UPDATE public.' + db.TABLES.projects + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
        [new Date(), newProjectData, project_id]
    );
    return res.rowCount;
}

/**
 *  * update the last modified date of a project
 * @param {int}  project_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function updateLastModifiedDate(project_id) {
    let res = await db.query(
        'UPDATE public.' + db.TABLES.projects + ' SET "date_last_modified" = $1 WHERE "id" = $2',
        [new Date(), project_id]
    );

    return res.rowCount;
}


/**
 *  * delete a project
 * @param {int} project_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(project_id) {
    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.projects + ' WHERE id = $1',
        [project_id]
    );
    return res.rowCount;
}

/**
 * select a project
 * @param {int} project_id
 * @returns {Object} project found
 */
async function selectById(project_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id = $1',
        [project_id]
    );

    return res.rows[0];
}

/**
 * select a project by id and userId, both must be integers!
 * @param {int} project_id
 * @param {int} user_id
 * @returns {Object} project found
 */
async function selectByIdAndUserId(project_id, user_id) {
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.projects + "  WHERE id = $1 AND data->'user_id' ? $2",
        [project_id, user_id + ""]
    );


    return res.rows[0];
}


 /**
 * select the project by a specific user
 * @param {int} user_id
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectByUserId(user_id, orderBy, sort, start, count) {

    //query to get projects
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projects + ' WHERE data->\'user_id\' ? $1  ORDER BY ' + orderBy + ' ' + sort + ' LIMIT $2 OFFSET $3',
        [user_id + "", count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*) FROM public.' + db.TABLES.projects + ' WHERE data->\'user_id\' ? $1  ', [user_id + ""]);

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}


/**
 * select the project by a specific  screening user
 * @param {int} user_id
 * @param {string} orderBy [id, date_created, date_last_modified, date_deleted]
 * @param {string} sort [ASC or DESC]
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectByScreeningUser(user_id, orderBy, sort, start, count) {

    //query to get projects
    let res = await db.query(
        "SELECT S.id, S.date_created, S.date_last_modified, S.date_deleted, S.project_id, S.data, P.id as project_id, P.data as project_data FROM public." + db.TABLES.projects + " P, public." + db.TABLES.screenings + " S WHERE P.id = S.project_id AND S.user_id = $1  ORDER BY P." + orderBy + " " + sort + " LIMIT $2 OFFSET $3",
        [user_id, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        "SELECT * FROM public." + db.TABLES.projects + " P, public." + db.TABLES.screenings + " S WHERE P.id = S.project_id AND S.user_id = $1",
        [user_id]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rowCount};
}


module.exports = {
    insert,
    update,
    updateLastModifiedDate,
    deletes,
    selectById,
    selectByUserId,
    selectByIdAndUserId,
    selectByScreeningUser,
};