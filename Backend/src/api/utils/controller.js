const formidable = require('formidable');
const fs = require('fs');
const fsPromises = fs.promises;
const MD5 = require("md5");
const env = require("../../../env");
const upload_path = env.upload_path;

exports.makeUploadDir = () => {
  fsPromises.mkdir(process.cwd() + upload_path, { recursive: true }).then(function () {
    // console.log('Directory created successfully');
  }).catch(function (err) {
    // console.log('failed to create directory. ', err);
    // console.log('errno  = ', err.errno);
    let errno = err.errno;
    if (errno === -4075) console.log("Already exists");
  });
}

const makeCollectionDir = (collectionName) => {
  fsPromises.mkdir(process.cwd() + upload_path + collectionName, { recursive: true }).then(function () {
    // console.log('Directory created successfully');
  }).catch(function (err) {
    // console.log('failed to create directory. ', err);
    let errno = err.errno;
    if (errno === -4075) console.log("Collection dir already exists");
  });
}

exports.viewFile = async (req, res) => {
  var fileSavingPath = process.cwd() + upload_path;
  res.sendFile(fileSavingPath + req.params.filename);
}

exports.uploadFile = async (req, res) => {
  var form = new formidable.IncomingForm();
  var re = /(?:\.([^.]+))?$/;
  form.parse(req, async function (err, fields, files) {
    var oldpath = files.itemFile.filepath;
    // console.log("files.itemFile = ", files.itemFile);      
    var ext = re.exec(files.itemFile.originalFilename)[1];
    let filename = MD5(Date.now().toString()) + "." + ext;
    var fileSavingPath = "";
    // console.log("fields.collectionName = ", fields.collectionName);
    if (fields.collectionName !== undefined) fileSavingPath = fields.collectionName + "/" + filename;
    else fileSavingPath = filename;
    // console.log("fileSavingPath = ", fileSavingPath);
    // console.log("process.cwd() + upload_path + fileSavingPath = ", process.cwd() + upload_path + fileSavingPath);
    await fs.copyFile(oldpath, process.cwd() + upload_path + fileSavingPath, function (err) {
      fs.unlink(oldpath, () => { });
      if (err) {
        console.log("file uploading failed ");
        return res.status(401).send({ success: false, message: "Empty file sent!" });
      }
      console.log("file uploading succeed : ", filename);
      return res.status(200).send({ success: true, path: fileSavingPath, message: "Successfully Update a Author" });
    });
  });
}

exports.uploadMultipleFile = async (req, res) => {
  var form = new formidable.IncomingForm();
  var re = /(?:\.([^.]+))?$/;

  form.parse(req, async function (err, fields, files) {
    // console.log("fields.fileArryLength = ", fields.fileArryLength);
    let i; let fileNameResultArr = [];
    for (i = 0; i < fields.fileArryLength; i++) {
      let oldpath = eval("files.fileItem" + i).filepath;
      console.log(`${i}th oldpath:`, oldpath);
      console.log("saving ", i, "th file...");
      var ext = re.exec(eval("files.fileItem" + i).originalFilename)[1];
      let filename = i.toString() + MD5(Date.now().toString()) + "." + ext;
      var fileSavingPath = "";
      if (fields.collectionName !== undefined) fileSavingPath = fields.collectionName + "/" + filename;
      else fileSavingPath = filename;
      await fs.copyFile(oldpath, process.cwd() + upload_path + fileSavingPath, function (err) {
        fs.unlink(oldpath, () => { });
        if (err) {
          console.log("file uploading failed : ", err);
          // res.status(401).send({ success: false, message: "Empty file sent!" });
        }
      });
      fileNameResultArr[i] = fileSavingPath;
    }

    if (i >= fields.fileArryLength) {
      console.log("Multiple uploading succeed : ", fileNameResultArr);
      return res.status(200).send({ success: true, paths: fileNameResultArr, message: "Successfully Update a Author" });
    }

  });
}
