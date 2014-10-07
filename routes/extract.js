var express = require('express');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var unzip = require('unzip');
var walk = require('walk');
var router = express.Router();
var sizeOf = require('image-size');
var events = require('events');
var utilities = require('./../helpers/utilities');
/* GET users listing. */

router.post('/', function(req, res) {
    var sessionKey = req.secret;
    var VDPath = __outputPath + "VD/";
    var fileOptions = req.files.decompress;
    var extension = fileOptions.extension;
    var path = fileOptions.path;
    var aliasFileName = fileOptions.name;
    var fileName = fileOptions.originalname;
    var that = this;


    function extractFiles() {
        //check if the file path exists
        if (fs.existsSync(__outputPath + aliasFileName)) {
            //move the zip file into the appropriate folder and rename it from alias name to the original name.
            fs.renameSync(__outputPath + aliasFileName, VDPath + fileName, function(err) {
                if (err) {
                    return err;
                }


            });
            if (extension === 'zip') {
                //unzip the folder
                fs.createReadStream(VDPath + fileName).pipe(unzip.Extract({
                    path: VDPath
                }).on('close', extractFilestoFolder));
            } else {
                extractFilestoFolder();
            }


        }
    };
    utilities.on('deleted', function() {

        extractFiles();
    });
    //write files in the destined folder
    function extractFilestoFolder() {
        //when unzip is complete send the image info to the user
        var path = {};
        //get the folder name 
        path.root = sessionKey;
        var images = [];

        walker = walk.walk(VDPath);
        //traverse the files
        walker.on("file", function(root, fileStats, next) {
            var image = {};

            if (fileStats.name.indexOf(".zip") === -1) {
                var imageBasePath = root.substring(root.indexOf("/result"));
                image.src = imageBasePath + fileStats.name;
                image.name = fileStats.name;
                var dimensions = sizeOf(root + '/' + fileStats.name);
                image.width = dimensions.width;
                image.height = dimensions.height;
                images.push(image);
            }
            next();


        });

        walker.on('end', function() {
            path.images = images;
            //after the file traversal is over send the info to UI
            res.send({
                "path": path
            });
        });


    }



    //check whether the directory already exists else create new directory 
    if (fs.existsSync(VDPath) === false) {

        fs.mkdirSync(VDPath);
        extractFiles();
    } else {

        //deleted the already existing files
        utilities.deleteFolderRecursive(VDPath);


    }


    




});

module.exports = router;
