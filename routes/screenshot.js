var express = require('express');
var url = require('url');
var webshot = require('webshot');
var fs      = require('fs');
var router = express.Router();
 
router.get('/', function(req, res) {

    var screenshotPath = __outputPath + "screenshot/";
 
var url_parts = url.parse(req.url, true);

     var screenShotURL = url_parts.query.url;
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      } 
    });
   // fs.rmdirSync(path);
  }
        
         saveScreenshot();
};

    if (screenShotURL === undefined || screenShotURL == '') {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end("404 Not Found");
  }
   	var filename = screenShotURL.replace(/\W/g, '_') + ".png"
     var options = {
       windowSize:{width:480,height:320},
       shotSize:{width:'all',height:'all'}
};
  function saveScreenshot(){
      webshot(screenShotURL, screenshotPath +filename,options, function(err) {
             if (err) throw err
               /*send the filename as response*/
             var imageBasePath=screenshotPath.substring(screenshotPath.indexOf("/result"));
      res.end(imageBasePath+filename);

});
  }
    
    if (fs.existsSync(screenshotPath) === false) {

        fs.mkdirSync(screenshotPath);
        saveScreenshot();
    }
    else{
        
        deleteFolderRecursive(screenshotPath);
    
        
    }
 
  
});
 
module.exports = router;