var express = require('express');
var router = express.Router();
var Busboy = require("busboy");
var path = require("path");
var os = require("os");
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadstl', function(req, res) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(__dirname, '../public/stl/' + filename);
      console.log(saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
    req.pipe(busboy);
});

module.exports = router;
