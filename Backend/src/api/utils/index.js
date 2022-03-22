const express = require('express');
const router = express.Router();
const utils = require("./controller");


router.post('/', function(req, res){
    console.log("requst test");
});
router.post('/upload_file', utils.uploadFile);
router.post('/upload_multiple_file', utils.uploadMultipleFile);
router.get('/view_file/:filename', utils.viewFile);

utils.makeUploadDir();

module.exports = router;