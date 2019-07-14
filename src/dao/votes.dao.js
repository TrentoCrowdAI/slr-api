const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a vote
 * @param {object} newVoteData
 * @returns {object} vote created
 */

async function insert(newVoteData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.votes + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3, $4) RETURNING *',
        [new Date(), new Date(), null, newVoteData]
    );

    return res.rows[0];
}




/**
 *  * update a vote
 * @param {int} vote_id
 * @param {object} newVoteData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(vote_id, newVoteData) {


    let res = await db.query(
        'UPDATE public.' + db.TABLES.votes + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
        [new Date(), newVoteData, vote_id]
    );

    return res.rowCount;
}


/**
 *  * delete a vote
 * @param {int} vote_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */

async function deletes(vote_id) {

    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.votes + ' WHERE id = $1',
        [vote_id]
    );

    return res.rowCount;
}

/**
 * select a vote
 * @param {int} vote_id
 * @returns {object} vote found
 */

async function selectById(vote_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.votes + ' WHERE id = $1',
        [vote_id]
    );

    return res.rows[0];
}


/**
 * select the votes by project_paper id
 * @param {int} projectPaper_id
 * @returns {array[]} the list of vote found
 */

async function selectByProjectPaperId(projectPaper_id) {
    let res = await db.query(
        "SELECT * FROM public.' + db.TABLES.votes + ' WHERE data->>'project_paper_id' = $1",
        [projectPaper_id]
    );

    return res.rows;
}

/**
 * select the votes by project_paper id and user id
  * @param {int} projectPaper_id
 * @param {int} user_id
 * @returns {object} vote found
 */

async function seletctByProjectPaperIdAndUserId(projectPaper_id, user_id) {
    let res = await db.query(
        "SELECT * FROM public.' + db.TABLES.votes + ' WHERE data->>'project_paper_id' = $1 AND data->>'user_id' = $2 ",
        [projectPaper_id, user_id]
    );

    return res.rows[0];
}


/**
 * select a vote list
 * @param {array[]} arrayFilterId
 * @returns {array[]} vote list found

async function selectByArrayId(arrayFilterId) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayFilterId, ",", "");

    //if joinString is empty
    if (joinString === "") {
        joinString = 0;
    }

    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.votes + " WHERE id IN ("+joinString+")"
    );

    return res.rows;
}

/**
 * select the vote associated with a project
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of vote and total number of result

async function selectByProject(project_id, orderBy, sort, start, count) {



    //query to get vote
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.votes + ' WHERE data->>\'project_id\' = $1  ORDER BY  ' + orderBy + '   ' + sort + ' LIMIT $2 OFFSET $3',
        [project_id, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.votes + ' WHERE data->>\'project_id\' = $1  ',
        [project_id]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}

/**
 * select all vote associated with a project
 * @param {int} project_id
 * @returns {Object} array of vote and total number of result

async function selectAllByProject(project_id) {


    //query to get vote
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.votes + ' WHERE data->>\'project_id\' = $1',
        [project_id]
    );

    return {"results": res.rows, "totalResults": (res.rows[0]) ? res.rows[0].count : 0};
}
 */

module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectByProjectPaperId,
    seletctByProjectPaperIdAndUserId
    //selectByArrayId,
   // selectByProject,
   // selectAllByProject,

};