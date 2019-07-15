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
 * @param {array[]} arrayPaperData a new list of newPaperData
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
 *  internal function==========================================================
 * check existence of papers in tables
 * @param {array[]} arrayEid of paper to check
 * @returns {array[]} arrayEid of papers that are already exist in table
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


/**
 * deprecated function selectBySingleKeyword and selectAll
 *==========================================================================
 *
 * select paper by a single keyword
 * @param {string} keyword to search
 * @param {string} searchBy [all, author, content] "content" means title+description
 * @param {string} year specific year to search
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of papers
 * @returns {Object} array of papers and total number of result

 async function selectBySingleKeyword(keyword, searchBy, year, orderBy, sort, start, count) {

    //set sql where condition by searchBy value
    let condition;
    switch (searchBy) {
        case "all":
            condition = " ( data->>'authors' = '" + keyword + "' OR data->>'title' = '" + keyword + "' OR data->>'year' = '" + keyword + "' OR data->>'source_title' = '" + keyword + "' OR data->>'link' = '" + keyword + "' OR data->>'abstract' = '" + keyword + "' OR data->>'document_type' = '" + keyword + "' OR data->>'source' = '" + keyword + "' OR data->>'eid' = '" + keyword + "' OR data->>'abstract_structured' = '" + keyword + "' OR data->>'filter_study_include' = '" + keyword + "' OR data->>'notes' = '" + keyword + "' ) ";
            break;
        case "author":
            condition = " ( data->>'authors' = '" + keyword + "' ) ";
            break;
        case "content":
            condition = " ( data->>'title' = '" + keyword + "' OR  data->>'abstract' = '" + keyword + "' ) ";
            break;
    }

    //set sql where condition2 by year
    let conditionOnYear = "";
    //if year isn't empty, set sql condition on year
    if (year !== "") {
        conditionOnYear = " AND ( data->>'year' = '" + year + "' )";
    }

    //query to get papers
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.searches + 'WHERE ' + condition + ' ' + conditionOnYear + '  ORDER BY data->>$1 ' + sort + ' LIMIT $2 OFFSET $3',
        [orderBy, count, start]
    );
    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*) FROM public.' + db.TABLES.searches + 'WHERE ' + condition + ' ' + conditionOnYear + ' ');


    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};

}



 /**
 * select all paper
 * @param {int} number number of papers
 * @param {int} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[]} array of papers
 *//*
 async function selectAll(number, offset, orderBy, sort) {
 let res = await db.query(
 'SELECT * FROM public.' + db.TABLES.searches + ' ORDER BY ' + orderBy + ' ' + sort + ' LIMIT $1 OFFSET $2',
 [number, offset]
 );

 return res.rows;
 }

 ===============================================================*/


module.exports = {
    insert,
    insertByList,
    update,
    deletes,
    selectById,
    //selectAll,
    //selectBySingleKeyword,
    checkExistenceByEids

};