
const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');


/**
 * insert a projectPaper
 * @param {int} project_id
 * @param {object} newProjectPaperData
 * @returns {object} projectPaper created
 */

async function insert(newProjectPaperData, project_id) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") VALUES($1,$2,$3, $4, $5) RETURNING *',
        [new Date(), new Date(), null, newProjectPaperData, project_id]
    );

    return res.rows[0];
}


/**
 * insert a list of projectPaper by copy from fake_paper table
 * @param {array[]} arrayEid array of paper eid
 * @param {int} project_id
 * @returns {array[]} projectPaper created
 */
async function insertFromPaper(arrayEid, project_id) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayEid, "," , "'");
    //if joinString is empty
    if (joinString === "") {
        joinString = "''";
    }

    let res = await db.query(
            'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") (SELECT $1, $2, $3, "data", $4 FROM public.' + db.TABLES.papers + ' WHERE data->>\'eid\' IN (' + joinString + ') ) RETURNING *',
            [new Date(), new Date(), null ,project_id]
            );



    return res.rows;
}

/**
 *  * update a projectPaper
 * @param {int} projectPaper_id
 * @param {object} newProjectPaperData
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function update(projectPaper_id, newProjectPaperData) {


    let res = await db.query(
            'UPDATE public.' + db.TABLES.projectPapers + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
            [new Date(), newProjectPaperData, projectPaper_id]
            );

    return res.rowCount;
}


/**
 *  * delete a projectPaper
 * @param {int} projectPaper_id
 * @returns {int} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(projectPaper_id) {

    let res = await db.query(
            'DELETE FROM public.' + db.TABLES.projectPapers + ' WHERE id = $1',
            [projectPaper_id]
            );

    return res.rowCount;
}

/**
 * select a projectPaper
 * @param {int} projectPaper_id
 * @returns {object} projectPaper found
 */
async function selectById(projectPaper_id) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE id = $1',
            [projectPaper_id]
            );

    return res.rows[0];
}

/**
 * select all projectPaper associated with a project
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 */
async function selectByProject(project_id, orderBy, sort, start, count) {

    if(orderBy !== "date_created"){
        orderBy = "data->>'"+orderBy+"'";
    }

    //query to get projects
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ORDER BY  '+orderBy +'   '+ sort + ' LIMIT $2 OFFSET $3',
        [project_id,  count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ',
        [project_id]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}

/**
 * search papers belonging to a project
 * @param {string} keyword to search
 * @param {int} project_id
 * @param {string} searchBy [all, author, content] "content" means title+description
 * @param year specific year to search
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of papers
 * @returns {Object} array of projectPapers and total number of result
 */
async function searchPaperByProject(keyword, project_id, searchBy, year, orderBy, sort, start, count) {

    //set sql where condition by searchBy value
    let condition;
    switch (searchBy) {
        case "all":
            condition = " AND ( data->>'authors' LIKE '%" + keyword + "%' OR data->>'title' LIKE '%" + keyword + "%' OR data->>'year' LIKE '%" + keyword + "%' OR data->>'source_title' LIKE '%" + keyword + "%' OR data->>'link' LIKE '%" + keyword + "%' OR data->>'abstract' LIKE '%" + keyword + "%' OR data->>'document_type' LIKE '%" + keyword + "%' OR data->>'source' LIKE '%" + keyword + "%' OR data->>'eid' LIKE '%" + keyword + "%' OR data->>'abstract_structured' LIKE '%" + keyword + "%' OR data->>'filter_study_include' LIKE '%" + keyword + "%' OR data->>'notes' LIKE '%" + keyword + "%' ) ";
            break;
        case "author":
            condition = " AND ( data->>'authors' LIKE '%" + keyword + "%' ) ";
            break;
        case "content":
            condition = " AND ( data->>'title' LIKE '%" + keyword + "%' OR  data->>'abstract' LIKE '%" + keyword + "%' ) ";
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
        'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE  project_id = $1 ' + condition + ' ' + conditionOnYear + '  ORDER BY data->>$2 ' + sort + ' LIMIT $3 OFFSET $4',
        [project_id, orderBy, count, start]
    );
    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*) FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1 ' + condition + ' ' + conditionOnYear + ' ',
        [project_id]
    );


    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}

/*=== deprecated function ===
async function selectByIdAndProjectId(paper_id, project_id){
    let paper_eid = await db.query(//I retrieve the eid of the paper to add
        'SELECT data->>\'EID\' as eid FROM public.' + db.TABLES.papers + ' WHERE id = $1',
        [paper_id]
    );
    paper_eid = paper_eid.rows[0].eid;
    let res = await db.query(//I check if the paper with the current eid is already in the project
        'SELECT id FROM public.' + db.TABLES.projectPapers + ' WHERE "project_id" = $1 AND data ->>\'EID\' = $2',
        [project_id, paper_eid]
    );
    return res.rows[0];//this will be defined only if the paper is already in the project
}*/


/**
 * internal function==========================================================
 * check existence of papers in tables
 * @param {array[]} arrayEid of paper to check
 * @param {int} project_id
 * @returns {array[]} arrayEid of papers that are already exist in table
 */
async function checkExistenceByEids(arrayEid, project_id) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayEid, "," , "'");
    //if joinString is empty
    if (joinString === "") {
        joinString = "''";
    }

    let res = await db.query(
        'SELECT data->>\'eid\' AS eid FROM public.' + db.TABLES.projectPapers + ' WHERE data->>\'eid\' IN (' + joinString + ') AND project_id = $1 ; ',
        [project_id]
    );

    let array =[];
    for(let i =0; i<res.rows.length; i++){
        array.push(res.rows[i].eid);
    }
    return array;
}
/*
* get project id of projectPaper by projectPaper id
* @param {int} projectPaper_id
* @returns {int} project id if there is projectPaper, -1 if it isn't exist
*//*
async function getProjectIdByProjectPaperId(projectPaper_id) {


    let res = await db.query(
        'SELECT project_id FROM public.' + db.TABLES.projectPapers + '  WHERE  id = $1 ; ',
        [projectPaper_id]
    );

    let output = -1;
    if(res.rows.length > 0){
        output = parseInt(res.rows[0].project_id);
    }


    return output;

}*/



module.exports = {
    insert,
    insertFromPaper,
    update,
    deletes,
    selectById,
    selectByProject,
    //selectByIdAndProjectId,
    searchPaperByProject,
    checkExistenceByEids,
    //getProjectIdByProjectPaperId
};