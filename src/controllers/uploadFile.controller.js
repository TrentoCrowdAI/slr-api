// this file exposes the logic implemented in uploadFile.delegate.js
// as services using express

const express = require('express');
//library to receive file data
const multer = require('multer');
//file system
const fs = require('fs');

//the config file
const config = require(__base + 'config');

const uploadFileDelegate = require(__base + 'delegates/uploadFile.delegate');
const router = express.Router();


//create a temp folder to save the tmp file
const createFolder= function(folder){
    try{
        fs.accessSync(folder);

    }catch(e){
        fs.mkdirSync(folder);
    }
};

//get a random number limited by max_number
const getNameIndexByRandom = function (){
    return Math.floor(Math.random()*config.file.max_number);
};

//calculate index of file respect the max number of files
createFolder(config.file.tmp_directory) ;

//the init config to storage file by multer
const storage = multer.diskStorage({
    "destination": function (req, file, cb) {
        cb(null, config.file.tmp_directory);
    },
    "filename": function (req, file, cb) {
        cb(null, "tmp"+getNameIndexByRandom());
    }
});
//create a instance of multer with storage config
const upload = multer({ storage: storage });


/*received the multi-file by post, the filed name of form must be "file" */
/*endpoint to parse the pdf file*/
router.post('/upload/pdf', upload.single('file'), async (req, res, next) => {
    try
    {
        let file = req.file;
        let output = await uploadFileDelegate.parsePdf(file);
        res.status(200).json(output);

    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});


/*endpoint to parse the csv file*/
router.post('/upload/csv', upload.single('file'), async (req, res, next) => {
    try
    {
        let user_email = res.locals.user_email;
        let file = req.file;
        let body = req.body;

        let output =  await uploadFileDelegate.parseCsv(user_email, body.project_id, body.fields, file);

        res.status(201).json(output);

    }
    catch (e)
    {
        // catch the error threw from delegate and we delegate to the error-handling middleware
        next(e);
    }
});



module.exports = router;
