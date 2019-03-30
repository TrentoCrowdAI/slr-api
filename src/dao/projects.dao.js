
const db = require(__base + "db/index");


/**
 * insert a project
 * @param {object} newProjectData
 * @returns {object} project created
 */
async function insert(newProjectData) {
    let res = await db.query(
            'INSERT INTO public.' + db.TABLES.projects + '("date_created", "date_last_modified", "date_deleted", "data") VALUES($1,$2,$3,$4) RETURNING *',
            [new Date(), new Date(), null, newProjectData]
            );
    return res.rows[0];
}



/**
 *  * update a project
 * @param {integer}  project_id
 * @param {object} newProjectData
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function update(project_id, newProjectData) {
    let res = await db.query(
            'UPDATE public.' + db.TABLES.projects + ' SET "date_last_modified" = $1,  "data" = $2 WHERE "id" = $3',
            [new Date(), newProjectData, project_id]
            );
    return res.rowCount;
}


/**
 *  * delete a project
 * @param {integer} project_id
 * @returns {integer} number of row affected , 1 if ok, 0 if failed
 */
async function deletes(project_id) {
    let res = await db.query(
            'DELETE FROM public.' + db.TABLES.projects + ' WHERE id = $1',
            [project_id]
            );
    return res.rowCount;
}

/**
 * select a project
 * @param {integer} project_id
 * @returns {object} project found
 */
async function selectById(project_id) {
    let res = await db.query(
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id = $1',
            [project_id]
            );
    
    return res.rows[0];
}

/**
 * select all project
 * @param {integer} number number of projects
 * @param {integer} after position where we begin to get
 * @param {integer} before position where to begin to get backwards
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projects 
 */
async function selectAll(number, after, before, orderBy, sort) {//orderBy and sort aren't used for lists of projects
    let res = undefined;
    if(isNaN(before)){//if 'before' is not defined it means we should check for 'after'
        res = await db.query(//I get the elements plus one extra one
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id > $1 ORDER BY '+"id"+' '+"ASC"+' LIMIT $2',
            [after, number+1]
            );
        let before = await db.query(//I check if there are elements before
            'SELECT id FROM public.' + db.TABLES.projects + ' WHERE id <= $1 LIMIT 1',
            [after]
        );
        return {"results" : res.rows.slice(0,number), "hasbefore" : (before.rows[0] ? true: false), "continues" : (res.rows.length > number)};
    }else{
        res = await db.query(//I get the elements before plus one extra one
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id < $1 ORDER BY '+"id"+' '+"DESC"+' LIMIT $2',
            [before, number+1]
        );
        let after =  await db.query(//I check if there are elements after the passed id
            'SELECT id FROM public.' + db.TABLES.projects + ' WHERE id >= $1 LIMIT 1',
            [before]
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


/**
 * 
 * select project by a single keyword
 * @param {string} keyword to search
 * @param {integer} number number of projects
 * @param {integer} offset position where we begin to get
 * @param {string} orderBy order of record in table, {id or date_created or date_last_modified or date_deleted}
 * @param {string} sort {ASC or DESC}
 * @returns {Array[Object]} array of projects 
 */
async function selectBySingleKeyword(keyword, number, after, before, orderBy, sort) {//orderBy and sort aren't currently used for lists of projects
    let res = undefined;
    if(isNaN(before)){//if 'before' is not defined it means we should check for 'after'
        res = await db.query(//I get the elements plus one extra one
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id > $1 AND CAST(data AS TEXT) LIKE $2 ORDER BY '+"id"+' '+"ASC"+' LIMIT $3',
            [after,"%" + keyword + "%", number+1]
            );
        let before = await db.query(//I check if there are elements before
            'SELECT id FROM public.' + db.TABLES.projects + ' WHERE id <= $1 AND CAST(data AS TEXT) LIKE $2 LIMIT 1',
            [after, "%" + keyword + "%"]
        );
        return {"results" : res.rows.slice(0,number), "hasbefore" : (before.rows[0] ? true: false), "continues" : (res.rows.length > number)};
    }else{
        res = await db.query(//I get the elements before plus one extra one
            'SELECT * FROM public.' + db.TABLES.projects + ' WHERE id < $1 AND CAST(data AS TEXT) LIKE $2 ORDER BY '+"id"+' '+"DESC"+' LIMIT $3',
            [before, "%" + keyword + "%", number+1]
        );
        let after =  await db.query(//I check if there are elements after the passed id
            'SELECT id FROM public.' + db.TABLES.projects + ' WHERE id >= $1 AND CAST(data AS TEXT) LIKE $2 LIMIT 1',
            [before, "%" + keyword + "%"]
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