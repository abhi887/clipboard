var express = require('express');
var router = express.Router();
var cors = require('cors');
var db = [];

router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "The api of clipboard application"});
});

router.post("/setClipboard",function(req,res,next){
  let clipboardName = req.body.clipboardName;
  let index = db.indexOf(db.find(x=>x.name===clipboardName));
  let clipboard = db[index];
  clipboard.value = req.body.clipboard;
  res.json({"clipboard":clipboard.value});
});

router.get("/getClipboard",function(req,res,next){
  let clipboardName = req.query.clipboardName;
  console.log(`clipboardName = ${clipboardName}`);
  let index = db.indexOf(db.find(x=>x.name===clipboardName));
  if(index === -1){
    clipboard = {name:clipboardName,value:""};
    db.push(clipboard)
  }
  else{
    clipboard = db[index];
  }
  res.json(clipboard.value);
});

router.delete("/clearClipboard",function(req,res,next){
  let clipboardName = req.body.clipboardName;
  let index = db.indexOf(db.find(x=>x.name===clipboardName));
  let clipboard = db[index];
  clipboard.value="";
  res.json({"status":"success","clipboard":clipboard.value});
});

module.exports = router;
