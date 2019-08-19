const db = require(__base + "db/index");
//supply the auxiliary function
const support = require(__base + 'utils/support');
//the config file
const config = require(__base + 'config');

/**
 * insert a projectPaper
 * @param {Object} newProjectPaperData
 * @param {int} project_id
 * @returns {Object} projectPaper created
 */

async function insert(newProjectPaperData, project_id) {
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") VALUES($1,$2,$3, $4, $5) RETURNING *',
        [new Date(), new Date(), null, newProjectPaperData, project_id]
    );

    return res.rows[0];
}

/**
 * insert a list of projectPaper
 * @param {Object[]} arrayProjectPaperData
 * @param {int} project_id
 * @returns {Object[]} projectPaper created
 */
async function insertByList(arrayProjectPaperData, project_id) {

    let values = "";
    //create sql values by array of papers
    for (let i = 0; i < arrayProjectPaperData.length; i++) {
        values += " ( now() , now() , " + null + " , $" + (i + 1) + " , " + project_id + " ) ";
        //if isn't last cycle, add a comma ad end of string
        if (i < arrayProjectPaperData.length - 1) {
            values += ",";
        }
    }

    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") VALUES ' + values + ' RETURNING *'
        , [...arrayProjectPaperData]
    );
    return res.rows;
}


/**
 * insert a list of projectPaper by copy from fake_paper table
 * @param {Object[]} arrayEid array of paper eid
 * @param {int} project_id
 * @returns {Object[]} projectPaper created
 */
async function insertFromPaper(arrayEid, project_id) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayEid, ",", "'");

    //if joinString is empty
    if (joinString === "") {
        joinString = "''";
    }

    //first, get the paper records from papers table by array of EID, then insert them into projectPapers table
    let res = await db.query(
        'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") (SELECT $1, $2, $3, "data", $4 FROM public.' + db.TABLES.searches + ' WHERE data->>\'eid\' IN (' + joinString + ') ) RETURNING *',
        [new Date(), new Date(), null, project_id]
    );


    return res.rows;
}

/**
 *  * update a projectPaper
 * @param {int} projectPaper_id
 * @param {Object} newProjectPaperData
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
 * @returns {Object} projectPaper found
 */

async function selectById(projectPaper_id) {
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE id = $1',
        [projectPaper_id]
    );

    return res.rows[0];
}

/**
 * select the projectPapers associated with a project
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 */
async function selectByProject(project_id, orderBy, sort, start, count) {

    //if the orderBy is based on the propriety of json data
    if (orderBy !== "date_created") {
        orderBy = "data->>'" + orderBy + "'";
    }

    //query to get projectPapers
    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ORDER BY  ' + orderBy + '   ' + sort + ' LIMIT $2 OFFSET $3',
        [project_id, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ',
        [project_id]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};
}


/**
 * select all projectPapers that haven't the automated screening value and screened field
 * @param {int} project_id
 * @returns {Object[]} array of projectPapers
 */
async function selectAllNotEvaluatedAndScreened(project_id) {


    //query to get projectPapers
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1 AND ( (NOT(P.data ? 'metadata')) OR (P.data ? 'metadata'  AND NOT(P.data->'metadata' ? 'automatedScreening') AND NOT(P.data->'metadata' ? 'screened')) )  ",
        [project_id]
    );

    return res.rows;
}


/**
 * select the projectPapers that isn't screened
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 * @param {number} min_confidence minimum confidence value of post
 * @param {number} max_confidence maximum confidence value of post
 * @returns {Object[]} array of projectPapers
 */
async function selectNotScreenedByProject(project_id, orderBy, sort, start, count, min_confidence, max_confidence) {

    //if the orderBy is based on the propriety of json data
    if (orderBy !== "date_created") {
        orderBy = "data->>'" + orderBy + "'";
    }

    let res;
    let resForTotalNumber;

    //if the min confidence is equal to 0 or is missing, includes papers that haven't confidence scores
    if (min_confidence === 0) {

        res = await db.query(
            "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  ( (NOT(P.data ? 'metadata')) OR (P.data ? 'metadata'  AND NOT(P.data->'metadata' ? 'screened') AND (  NOT(P.data->'metadata' ? 'automatedScreening') OR P.data->'metadata'->'automatedScreening'->>'value' <= $2)   ) )   ORDER BY  " + orderBy + "   " + sort + " LIMIT $3 OFFSET $4",
            [project_id, max_confidence,count, start]
        );

        //query to get total number of result
        resForTotalNumber = await db.query(
            "SELECT COUNT(*) FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  ( (NOT(P.data ? 'metadata')) OR (P.data ? 'metadata'  AND NOT(P.data->'metadata' ? 'screened') AND (  NOT(P.data->'metadata' ? 'automatedScreening') OR P.data->'metadata'->'automatedScreening'->>'value' <= $2)   ) )   ",
            [project_id, max_confidence]
        );

    }
    else{
        res = await db.query(
            "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  P.data ? 'metadata'  AND NOT(P.data->'metadata' ? 'screened') AND   P.data->'metadata' ? 'automatedScreening' AND P.data->'metadata'->'automatedScreening'->>'value' >= $2 AND P.data->'metadata'->'automatedScreening'->>'value' <=  $3       ORDER BY  " + orderBy + "   " + sort + " LIMIT $4 OFFSET $5",
            [project_id, min_confidence, max_confidence, count, start]
        );

        //query to get total number of result
        resForTotalNumber = await db.query(
            "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  P.data ? 'metadata'  AND NOT(P.data->'metadata' ? 'screened') AND   P.data->'metadata' ? 'automatedScreening' AND P.data->'metadata'->'automatedScreening'->>'value' >= $2 AND P.data->'metadata'->'automatedScreening'->>'value' <=  $3  ",
            [project_id, min_confidence,max_confidence]
        );
    }



    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};

}

/**
 * select all projectPapers that have  screening_status = manual
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 * @returns {Object[]} array of projectPapers
 */
async function selectManualByProject(project_id, orderBy, sort, start, count) {

    //if the orderBy is based on the propriety of json data
    if (orderBy !== "date_created") {
        orderBy = "data->>'" + orderBy + "'";
    }

    //query to get projectPapers
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  P.data ? 'metadata'  AND P.data->'metadata' ? 'screened' AND  P.data->'metadata'->>'screened'  = $2  ORDER BY  " + orderBy + "   " + sort + " LIMIT $3 OFFSET $4",
        [project_id, config.screening_status.manual, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        "SELECT COUNT(*) FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  P.data ? 'metadata'  AND P.data->'metadata' ? 'screened' AND  P.data->'metadata'->>'screened'  = $2  ",
        [project_id, config.screening_status.manual]
    );

    return {"results": res.rows, "totalResults": resForTotalNumber.rows[0].count};

}

/**
 * counts the papers that have been automatically screened and the total number of papers
 * @param {int} project_id
 * @returns {Object} totalAutoScreened, totalPapers
 */
async function countAutoScreenedOutOfTotalPapers(project_id) {

    //query to get total number of result
    let resForTotalAutoScreened = await db.query(
        "SELECT COUNT(*) FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND  P.data ? 'metadata'  AND P.data->'metadata' ? 'automatedScreening' ",
        [project_id]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ',
        [project_id]
    );

    return {
        "totalAutoScreened": resForTotalAutoScreened.rows[0].count,
        "totalResults": resForTotalNumber.rows[0].count
    };

}

/**
 * select all projectPapers that have the final screening result
 * @param {int} project_id
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of projects
 * @returns {Object} array of projectPapers and total number of result
 * @returns {Object[]} array of projectPapers
 */
async function selectScreenedByProject(project_id, orderBy, sort, start, count) {

    //if the orderBy is based on the propriety of json data
    if (orderBy !== "date_created") {
        orderBy = "data->>'" + orderBy + "'";
    }

    //query to get projectPapers
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND P.data ? 'metadata' AND P.data->'metadata' ? 'screened' AND  P.data->'metadata'->>'screened' = $2 ORDER BY  " + orderBy + "   " + sort + " LIMIT $3 OFFSET $4",
        [project_id, config.screening_status.screened, count, start]
    );

    //query to get total number of result
    let resForTotalNumber = await db.query(
        "SELECT COUNT(*) FROM public." + db.TABLES.projectPapers + " P WHERE P.project_id = $1  AND P.data ? 'metadata' AND P.data->'metadata' ? 'screened'  AND  P.data->'metadata'->>'screened'  = $2 ",
        [project_id, config.screening_status.screened]
    );

    //query to get total number of papers in a project
    let resForTotalPapers = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ',
        [project_id]
    );

    return {
        "results": res.rows,
        "totalResults": resForTotalNumber.rows[0].count,
        "totalPapers": resForTotalPapers.rows[0].count
    };
}


/**
 * search papers belonging to a project
 * @param {string} keyword to search
 * @param {int} project_id
 * @param {string} searchBy [all, author, content] "content" means title+description
 * @param {string} year specific year to search
 * @param {string} orderBy each paper data.propriety
 * @param {string} sort {ASC or DESC}
 * @param {int} start offset position where we begin to get
 * @param {int} count number of papers
 * @returns {Object} array of projectPapers and total number of result
 *//*
async function searchPaperByProject(keyword, project_id, searchBy, year, orderBy, sort, start, count) {

    //set first sql condition by searchBy value
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

    //set second sql condition by year
    let conditionOnYear = "";
    //if year isn't empty, set sql condition on year
    if (year !== "") {
        conditionOnYear = " AND ( data->>'year' = '" + year + "' )";
    }

    //query to get progetPapers
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
*/

/**
 * select a not voted projectPaper by UserId and projectId
 * @param {int} user_id
 * @param {int} project_id
 * @returns {Object} projectPaper found
 */
async function selectOneNotVotedByUserIdAndProjectId(user_id, project_id) {
    //SELECT P.date_created,P.data->'title' FROM public.project_papers P  WHERE  project_id= 9 AND 
    //( ( NOT(P.data ? 'metadata') )  OR 
    //((P.data ? 'metadata') AND (NOT(P.data->'metadata' ? 'screened'))) OR
    //((P.data->'metadata'?'screened') AND (P.data->'metadata'->>'screened' <> 'screened'))  )  
    //AND P.id NOT IN( SELECT project_paper_id FROM public.votes WHERE user_id = 3 AND project_id = 9 ) ORDER BY date_created, data->'title' ASC
    let res = await db.query(
        "SELECT * FROM public." + db.TABLES.projectPapers + " P  WHERE  project_id= $2" + " AND " +
        "( ( NOT(P.data ? 'metadata') ) " + " OR " +
        "(P.data ? 'metadata' AND (NOT(P.data->'metadata' ? 'screened') ) )  OR" +
        "((P.data->'metadata'?'screened') AND (P.data->'metadata'->>'screened' <> $3))  )" +
        "AND P.id NOT IN( SELECT project_paper_id FROM public." + db.TABLES.votes + " WHERE user_id = $1 AND project_id = $2 )" +
        " ORDER BY date_created, data->'title' ASC",
        [user_id, project_id, config.screening_status.screened]
    );

    return res.rows[0];
}

/**
 * it returns the number of screened papers out of the total number of papers in the project
 * @param {int} user_id
 * @param {int} project_id
 * @returns {Object} progress
 */
async function manualScreeningProgress(user_id, project_id) {

    //query to get total number of result
    let resForTotalNumber = await db.query(
        'SELECT COUNT(*)  FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1  ',
        [project_id]
    );

    let resForTotalScreened = await db.query(
        "SELECT COUNT(*) FROM public." + db.TABLES.projectPapers + " P  WHERE  project_id= $2" + " AND " +
        "( ( NOT(P.data ? 'metadata') ) " + " OR " +
        "(P.data ? 'metadata' AND (NOT(P.data->'metadata' ? 'screened') ) )  OR" +
        "((P.data->'metadata'?'screened') AND (P.data->'metadata'->>'screened' <> $3))  )" +
        "AND P.id NOT IN( SELECT project_paper_id FROM public." + db.TABLES.votes + " WHERE user_id = $1 AND project_id = $2 )",
        [user_id, project_id, config.screening_status.screened]
    );

    return {
        "totalPapers": parseInt(resForTotalNumber.rows[0].count),
        "screenedPapers": parseInt(resForTotalNumber.rows[0].count) - parseInt(resForTotalScreened.rows[0].count)
    };
}

/**
 * select all paper of a specific project
 * @param {int} project_id
 * @returns {Object[]} array of paper object
 */
async function selectAllByProjectId(project_id){

    let res = await db.query(
        'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE project_id = $1',
        [project_id]
    );

    return res.rows;
}


/**
 * internal function==========================================================
 *
 * check existence of papers in tables
 * @param {Object[]} arrayEid of paper to check
 * @param {int} project_id
 * @returns {Object[]} arrayEid of papers that are already exist in table
 */
async function checkExistenceByEids(arrayEid, project_id) {

    //transform array in string where each element is surrounded by '
    let joinString = support.arrayToString(arrayEid, ",", "'");
    //if joinString is empty
    if (joinString === "") {
        joinString = "''";
    }

    let res = await db.query(
        'SELECT data->>\'eid\' AS eid FROM public.' + db.TABLES.projectPapers + ' WHERE data->>\'eid\' IN (' + joinString + ') AND project_id = $1 ; ',
        [project_id]
    );

    let array = [];
    for (let i = 0; i < res.rows.length; i++) {
        array.push(res.rows[i].eid);
    }
    return array;
}


module.exports = {
    insert,
    insertFromPaper,
    insertByList,
    update,
    deletes,
    selectById,
    selectByProject,
    selectAllNotEvaluatedAndScreened,
    selectNotScreenedByProject,
    selectManualByProject,
    selectScreenedByProject,
    selectOneNotVotedByUserIdAndProjectId,
    manualScreeningProgress,

    selectAllByProjectId,
    checkExistenceByEids,

    countAutoScreenedOutOfTotalPapers,
    //searchPaperByProject,
};