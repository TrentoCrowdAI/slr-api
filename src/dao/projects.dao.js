const db = require(__base + "db/index");


/**
 * insert a project
 * @param {object} newProjectData
 * @returns {object} project created
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
 * @param {object} newProjectData
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
 * @returns {object} project found
 */
async function selectById(project_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id = $1',
        [project_id]
    );

    return res.rows[0];
}

/**
 * select all project
 * @param {string} orderBy [id, date_last_modified}
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectAll(orderBy, sort, start, count) {

    //query to get projects
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projects + '  ORDER BY ' + orderBy + ' ' + sort + ' LIMIT $1 OFFSET $2',
        [count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*) FROM public.' + db.TABLES.projects);

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}


/**
 * select project by a single keyword
 * @param {string} keyword to search
 * @param {string} orderBy [id, date_last_modified}
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projects and total number of result
 */
async function selectBySingleKeyword(keyword, orderBy, sort, start, count) {


    //query to get projects
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projects + ' WHERE data->>\'name\' LIKE $1 OR data->>\'description\' LIKE $1  ORDER BY ' + orderBy + ' ' + sort + ' LIMIT $2 OFFSET $3',
        ["%"+keyword+"%", count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*) FROM public.' + db.TABLES.projects + ' WHERE data->>\'name\' LIKE $1 OR data->>\'description\' LIKE $1 ',
        ["%"+keyword+"%"]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};

}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword

};