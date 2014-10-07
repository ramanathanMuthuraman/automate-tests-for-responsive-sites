var fs      = require('fs');
var util = require('util');
var events = require('events');
 
function Utilities() {
 var that=this;
  events.EventEmitter.call(this); // making the Batter class a event emitter. 
//Invoking the EventEmitter's constructor with Batter.
  this.deleteFolderRecursive = function(path)
  {
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
   that.emit('deleted');
  }
}
util.inherits(Utilities, events.EventEmitter);

module.exports = new Utilities();
