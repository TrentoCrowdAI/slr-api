const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a filter
 * @param {object} newFilterData
 * @param {int} project_id
 * @returns {object} filter created
 */

async function insert(newFilterData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.filters + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3, $4) RETURNING *',
        [new Date(), new Date(), null, newFilterData]
    );

    return res.rows[0];
}




/**
 *  * update a filter
 * @param {int} filter_id
 * @param {object} newFilterData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(filter_id, newFilterData) {


    let res = await db.query(
        'UPDATE public.' + db.TABLES.filters + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
        [new Date(), newFilterData, filter_id]
    );

    return res.rowCount;
}


/**
 *  * delete a filter
 * @param {int} filter_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */

async function deletes(filter_id) {

    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.filters + ' WHERE id = $1',
        [filter_id]
    );

    return res.rowCount;
}

/**
 * select a filter
 * @param {int} filter_id
 * @returns {object} filter found
 */

async function selectById(filter_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.filters + ' WHERE id = $1',
        [filter_id]
    );

    return res.rows[0];
}

/**
 * select a filter list
 * @param {array[]} arrayFilterId
 * @returns {array[]} filter list found
 */

async function selectByArrayId(arrayFilterId) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayFilterId, ",", "");

    //if joinString is empty
    if (joinString === "") {
        joinString = 0;
    }

    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.filters + " WHERE id IN ("+joinString+")"
    );

    return res.rows;
}

/**
 * select the filters associated with a project
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of filters and total number of result
 */
async function selectByProject(project_id, orderBy, sort, start, count) {



    //query to get filters
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.filters + ' WHERE data->>\'project_id\' = $1  ORDER BY  ' + orderBy + '   ' + sort + ' LIMIT $2 OFFSET $3',
        [project_id, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.filters + ' WHERE data->>\'project_id\' = $1  ',
        [project_id]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}




module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectByArrayId,
    selectByProject,

};