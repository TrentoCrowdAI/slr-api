const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a vote
 * @param {Object} newVoteData
 * @param {int} user_id
 * @param {int} project_paper_id
 * @param {int} project_id
 * @returns {Object} vote created
 */


async function insert(newVoteData, user_id, project_paper_id, project_id) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.votes + '("date_created", "date_last_modified", "date_deleted", "data", "user_id", "project_paper_id", "project_id") VALUES($1,$2,$3, $4, $5, $6, $7) RETURNING *',
        [new Date(), new Date(), null, newVoteData, user_id, project_paper_id, project_id]
    );

    return res.rows[0];
}


/**
 *  * update a vote
 * @param {int} vote_id
 * @param {Object} newVoteData
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
 *  * delete the votes by project and user
 * @param {int} project_id
 * @param {int} user_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */

async function deleteByProjectIdAndUserId(project_id, user_id) {

    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.votes + ' WHERE project_id = $1 AND user_id = $2 ',
        [project_id, user_id]
    );

    return res.rowCount;
}

/**
 * select a vote
 * @param {int} vote_id
 * @returns {Object} vote found
 */

async function selectById(vote_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.votes + ' WHERE id = $1',
        [vote_id]
    );

    return res.rows[0];
}


/**
 * select the votes by user id
 * @param {int} user_id
 * @returns {Object[]} the list of vote found
 */

async function selectByUserId(user_id) {
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.votes + " WHERE user_id = $1",
        [user_id]
    );

    return res.rows;
}

/**
 * select the votes by project_paper id
 * @param {int} projectPaper_id
 * @returns {Object[]} the list of vote found
 */

async function selectByProjectPaperId(projectPaper_id) {
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.votes + " WHERE project_paper_id = $1",
        [projectPaper_id]
    );

    return res.rows;
}


/**
 * select the votes by project id
 * @param {int} project_id
 * @returns {Object[]} the list of vote found
 */

async function selectByProjectId(project_id) {
    let res = await db.query(
        "SELECT * FROM public."+ db.TABLES.votes + " WHERE project_id = $1",
        [project_id]
    );

    return res.rows;
}

/**
 * select the votes by project_paper id and user id
 * @param {int} projectPaper_id
 * @param {int} user_id
 * @returns {Object} vote found
 */

async function selectByProjectPaperIdAndUserId(projectPaper_id, user_id) {
    let res = await db.query(
        "SELECT * FROM public."+ db.TABLES.votes + " WHERE project_paper_id = $1 AND user_id = $2 ",
        [projectPaper_id, user_id]
    );

    return res.rows[0];
}


module.exports = {
    insert,
    update,
    deletes,
    deleteByProjectIdAndUserId,
    selectById,
    selectByUserId,
    selectByProjectPaperId,
    selectByProjectId,
    selectByProjectPaperIdAndUserId

};