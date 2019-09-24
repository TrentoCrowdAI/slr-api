const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a paper
 * @param {Object} newPaperData
 * @returns {Object} paper created
 */
async function insert(newPaperData) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.searches + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
        [new Date(), new Date(), null, newPaperData]
    );
    return res.rows[0];
}

/**
 * insert a list of paper
 * @param {Object[]} arrayPaperData a new list of newPaperData
 * @returns {Object} paper created
 */
async function insertByList(arrayPaperData) {

    let values = "";
    //create sql values by array of papers
    for (let i = 0; i < arrayPaperData.length; i++) {
        values += " ( now() , now() , " + null + " , $" + (i + 1) + " ) ";
        //if isn't last cycle, add a comma ad end of string
        if (i < arrayPaperData.length - 1) {
            values += ",";
        }
    }

    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.searches + '("date_created", "date_last_modified", "date_deleted", "data") VALUES ' + values + ' RETURNING *'
        , [...arrayPaperData]
    );
    return res.rows;
}


/**
 *  * update a paper
 * @param {int}  paper_id
 * @param {Object} newPaperData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(paper_id, newPaperData) {
    let res = await db.query(
        'UPDATE public.' + db.TABLES.searches + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
        [new Date(), newPaperData, paper_id]
    );
    return res.rowCount;
}


/**
 *  * delete a paper
 * @param {int} paper_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(paper_id) {
    let res = await db.query(
        'DELETE FROM public.' + db.TABLES.searches + ' WHERE id = $1',
        [paper_id]
    );
    return res.rowCount;
}

/**
 * select a paper
 * @param {int} paper_id
 * @returns {Object} paper found
 */
async function selectById(paper_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.searches + ' WHERE id = $1',
        [paper_id]
    );
    return res.rows[0];
}

/**
 *  internal function==========================================================
 * check existence of papers in tables
 * @param {Object[]} arrayEid of paper to check
 * @returns {Object[]} arrayEid of papers that are already exist in table
 */
async function checkExistenceByEids(arrayEid) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayEid, ",", "'");
    //if joinString is empty
    if (joinString === "") {
        joinString = "''";
    }

    let res = await db.query(
        'SELECT data->>\'eid\' AS eid FROM public.' + db.TABLES.searches + ' WHERE data->>\'eid\' IN (' + joinString + ');'
    );

    let array = [];
    for (let i = 0; i < res.rows.length; i++) {
        array.push(res.rows[i].eid);
    }
    return array;

}



module.exports = {
    insert,
    insertByList,
    update,
    deletes,
    selectById,
    checkExistenceByEids

};