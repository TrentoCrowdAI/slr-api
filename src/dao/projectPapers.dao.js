
const db = require(__base + "db/index");


/**
 * insert a projectPaper
 * @param {integer} project_id
 * @param {object} newProjectPaperData
 * @returns {object} projectPaper created
 */
/*
 async function insert(project_id, newProjectPaperData) {
 let res = await db.query(
 'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") VALUES($1,$2,$3, $4, $5) RETURNING *',
 [new Date(), new Date(), null, newProjectPaperData, project_id]
 );
 return res.rows[0];
 }*/
/**
 * insert a projectPaper by copie from fake_paper table
 * @param {integer} paper_id
 * @param {integer} project_id
 * @param {object} newProjectPaperData
 * @returns {object} projectPaper created
 */
async function insertFromPaper(paper_id, project_id) {
    let res = await db.query(
            'INSERT INTO public.' + db.TABLES.projectPapers + '("date_created", "date_last_modified", "date_deleted", "data", "project_id") (SELECT "date_created", "date_last_modified", "date_deleted", "data", $1 FROM public.' + db.TABLES.papers + ' WHERE id = $2 ) RETURNING *',
            [project_id, paper_id]
            );
    return res.rows[0];
}

/**
 *  * update a projectPaper
 * @param {integer} projectPaper_id
 * @param {object} newProjectPaperData
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
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
 * @param {integer} projectPaper_id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
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
 * @param {integer} projectPaper_id
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
 * @param {integer} project_id
 * @param {integer} number number of projectPapers
 * @param {integer} after the id of the first element to get
 * @param {integer} before position where to begin to get backwards
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projectPapers 
 */
async function selectByProject(project_id, number, after, before, orderBy, sort) {//the last 2 variables are still incompatible with our way of pagination
    let res = undefined;
    if(isNaN(before)){//if 'before' is not defined it means we should check for 'after'
        res = await db.query(//I get the elements plus one extra one
            'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE "project_id" = $1 AND id > $2 ORDER BY '+"id"+' '+"ASC"+' LIMIT $3',
            [project_id, after, number+1]
            );
        let before = await db.query(//I check if there are elements before
            'SELECT id FROM public.' + db.TABLES.projectPapers + ' WHERE "project_id" = $1 AND id <= $2 LIMIT 1',
            [project_id, after]
        );
        return {"results" : res.rows.slice(0,number), "hasbefore" : (before.rows[0] ? true: false), "continues" : (res.rows.length > number)};
    }else{
        res = await db.query(//I get the elements before plus one extra one
            'SELECT * FROM public.' + db.TABLES.projectPapers + ' WHERE "project_id" = $1 AND id < $2 ORDER BY '+"id"+' '+"DESC"+' LIMIT $3',
            [project_id, before, number+1]
        );
        let after =  await db.query(//I check if there are elements after the passed id
            'SELECT id FROM public.' + db.TABLES.projectPapers + ' WHERE "project_id" = $1 AND id >= $2 LIMIT 1',
            [project_id, before]
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
    insertFromPaper,
    update,
    deletes,
    selectById,
    selectByProject

};