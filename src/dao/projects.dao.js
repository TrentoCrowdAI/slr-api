
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
 * @param {integer}  project_id
 * @param {object} newProjectData
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
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
 * @param {integer} project_id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
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
 * @param {integer} project_id
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
 * @param {integer} number number of projects
 * @param {integer} after position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projects 
 */
async function selectAll(number, after, orderBy, sort) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id > $1 ORDER BY '+orderBy+' '+sort+' LIMIT $2',
            [after, number+1]
            );
    return {"results" : res.rows.slice(0,number), "continues" : (res.rows[number] ? true : false)};
}


/**
 * 
 * select project by a single keyword
 * @param {string} keyword to search
 * @param {integer} number number of projects
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projects 
 */
async function selectBySingleKeyword(keyword, number, offset, orderBy, sort) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE CAST(data AS TEXT) LIKE $1  ORDER BY '+orderBy+' '+sort+' LIMIT $2 OFFSET $3',
            ["%" + keyword + "%", number, offset]
            );

    return res.rows;
}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword

};