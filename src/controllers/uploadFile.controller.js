// this file exposes the logic implemented in uploadFile.delegate.js
// as services using express

const express = require('express');
//library to receive file data
const multer = require('multer');
//file system
const fs = require('fs');

const uploadFileDelegate = require(__base + 'delegates/uploadFile.delegate');
const router = express.Router();


//create a temp folder to save the tmp file
//the path of temp folder
const uploadFolder = './tmp/';
const createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};
createFolder(uploadFolder);

//the init config to storage file by multer
const storage = multer.diskStorage({
    "destination": function (req, file, cb) {
        cb(null, uploadFolder);
    },
    "filename": function (req, file, cb) {
        cb(null, "tmp.pdf");
    }
});
//create a instance of multer with storage config
const upload = multer({ storage: storage });


/*received the multi-file by post, the filed name of form must be "file" */
router.post('/pdf', upload.single('file'), async (req, res, next) => {
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




module.exports = router;
