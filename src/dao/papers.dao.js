
const db = require(__base + "db/index");


/**
 * insert a paper
 * @param {object} paper
 * @returns {object} paper created
 */
async function insert(paper) {
    let res = await db.query(
            'INSERT INTO public.' + db.TABLES.papers + '("date_created", "date_last_modified", "date_deleted", "content") VALUES($1,$2,$3,$4) RETURNING *',
            [new Date(), new Date(), null, paper.content]
            );
    return res.rows[0];
}



/**
 *  * update a paper
 * @param {object} paper
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function update(paper) {
    let res = await db.query(
            'UPDATE public.' + db.TABLES.papers + ' SET "date_created" = $1, "date_last_modified" = $2, "date_deleted" = $3, "content" = $4 WHERE "id" = $5',
            [paper.date_created, paper.date_last_modified, paper.date_deleted, paper.content, paper.id]
            );
    return res.rowCount;
}


/**
 *  * delete a paper
 * @param {integer} id paper id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(id) {
    let res = await db.query(
            'DELETE FROM public.' + db.TABLES.papers + ' WHERE id = $1',
            [id]
            );
    return res.rowCount;
}

/**
 * select a paper
 * @param {integer} id paper id
 * @returns {object} paper found
 */
async function selectById(id) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE id = $1',
            [id]
            );
    
    return res.rows[0];
}

/**
 * select all paper
 * @param {integer} number number of papers
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers 
 */
async function selectAll(number, offset, orderBy, sort) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.papers + ' ORDER BY '+orderBy+' '+sort+' LIMIT $1 OFFSET $2',
            [number, offset]
            );

    return res.rows;
}


/**
 * 
 * select paper by a single keyword
 * @param {string} keyword to search
 * @param {integer} number number of papers
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers 
 */
async function selectBySingleKeyword(keyword, number, offset, orderBy, sort) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE content LIKE $1  ORDER BY '+orderBy+' '+sort+' LIMIT $2 OFFSET $3',
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