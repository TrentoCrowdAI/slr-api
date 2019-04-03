
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
 * @param {integer} after the id of the first element to get
 * @param {integer} before position where to begin to get backwards
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of papers 
 */
async function selectBySingleKeyword(keyword, number, after, before, orderBy, sort) {

    let res = undefined;
    if(isNaN(before)){//if 'before' is not defined it means we should check for 'after'
        res = await db.query(//I get the elements plus one extra one
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE CAST(data AS TEXT) LIKE $1 AND id > $2 ORDER BY '+"id"+' '+"ASC"+' LIMIT $3',
            ["%" + keyword + "%", after, number+1]
            );
        let before = await db.query(//I check if there are elements before
            'SELECT id FROM public.' + db.TABLES.papers + ' WHERE CAST(data AS TEXT) LIKE $1 AND id <= $2 LIMIT 1',
            ["%" + keyword + "%", after]
        );
        return {"results" : res.rows.slice(0,number), "hasbefore" : (before.rows[0] ? true: false), "continues" : (res.rows.length > number)};
    }else{
        res = await db.query(//I get the elements before plus one extra one
            'SELECT * FROM public.' + db.TABLES.papers + ' WHERE CAST(data AS TEXT) LIKE $1 AND id < $2 ORDER BY '+"id"+' '+"DESC"+' LIMIT $3',
            ["%" + keyword + "%", before, number+1]
        );
        let after =  await db.query(//I check if there are elements after the passed id
            'SELECT id FROM public.' + db.TABLES.papers + ' WHERE CAST(data AS TEXT) LIKE $1 AND id >= $2 LIMIT 1',
            ["%" + keyword + "%",  before]
        );
        hasbefore =  (res.rows.length > number);//if I retrieved one extra element it means there's still something before the results
        let array = res.rows.slice(0, number);//I remove the extra element since the client doesn't need it
        array.sort(function(a, b) { //I sort the array in ASC again to be printed
            var x = Number(a['id']); var y = Number(b['id']);
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
        return {"results" : array, "hasbefore" : hasbefore ,"continues" : (after.rows[0] ? true : false)};
    }
}


module.exports = {
    insert,
    update,
    deletes,
    selectById,
    selectAll,
    selectBySingleKeyword

};