
const db = require(__base + "db/index");


/**
 * insert a paper
 * @param {object} newPaperData
 * @returns {object} paper created
 */
async function insert(newPaperData) {
    let res = await db.query(
            'INSERT INTO public.' + db.TABLES.papers + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
            [new Date(), new Date(), null, newPaperData]
            );
    return res.rows[0];
}



/**
 *  * update a paper
 * @param {integer}  paper_id
 * @param {object} newPaperData
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function update(paper_id, newPaperData) {
    let res = await db.query(
            'UPDATE public.' + db.TABLES.papers + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
            [new Date(), newPaperData, paper_id]
            );
    return res.rowCount;
}


/**
 *  * delete a paper
 * @param {integer} paper id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(paper_id) {
    let res = await db.query(
            'DELETE FROM public.' + db.TABLES.papers + ' WHERE id = $1',
            [paper_id]
            );
    return res.rowCount;
}

/**
 * select a paper
 * @param {integer} paper_id
 * @returns {object} paper found
 */
async function selectById(paper_id) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE id = $1',
            [paper_id]
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
    //I select all the results and then I slice(it's kinda inefficient)
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE CAST(data AS TEXT) LIKE $1  ORDER BY '+orderBy+' '+sort,
            ["%" + keyword + "%"]
            );
    //another idea could be to use two queries, one for counting and one for returning with LIMIT OFFSET
    return {"results" : res.rows.slice(offset, offset+number), "total" : res.rows.length};
}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword

};