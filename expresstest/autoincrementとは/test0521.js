var app = require('express')();
var server = require('http').Server(app);
//これをつけることが非常に重要みたいな？
var express = require('express');
var session = require('express-session');  // Session 機能
var cookieParser = require('cookie-parser');
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
//mongoose使いますよ宣言
var mongoose = require('mongoose');
// 定義フェーズ　スキーマ使いますよ宣言
var Schema   = mongoose.Schema;
var autoIncrement = require("mongoose-auto-increment");


//mongodbはこれでつなぎますよ宣言　DBまで指定（例：test)
  //DB　変えたいときは　   db.connection.close(); が必要
    var connection = mongoose.connect('mongodb://192.168.33.72/test');
    //autoIncrement用のもの
    autoIncrement.initialize(connection);

//スキーマはこのような型でいきますよ宣言
var UserSchema = new Schema({
  name:  String,
  view:Number,
  score:Number,
  date: { type: Date, default: Date.now },
  title:String,
  memo:String,
  ssid:String
});
UserSchema.plugin(autoIncrement.plugin, 'Book');
var Book = connection.model('Book', UserSchema);




    mongoose.model('ViewGiron2', UserSchema);//viewgiron2 のcollectionで、と
      var ViewG2 = mongoose.model('ViewGiron2'); //scemaを適用するよ、と。

  mongoose.model('member1', UserSchema);
    var Cm = mongoose.model('member1'); //scemaを適用するよ、と。


    mongoose.model('comment2', UserSchema);
      var Cm2 = mongoose.model('comment2');


//▪️▪️mongoose　　宣言部分！！***********************************

//view フォルダを見ます。のあとなければしたの処理に従って、publicフォルダを見ます。
app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');

//覚書 ejs は res.render("ファイル名");
 app.use(express.static(__dirname + "/public"));//express の便利な命令　⇨この中にそのファイル名があれば読み込みます
 app.use(cookieParser("conan"));//これによってデベロッパーツールでみたときに暗号化されたのを確認
//secret:"秘密の暗号化文字列"
  app.use(session({
    secret:'foo',
    key:"bbb",
    ttl:14 * 24 * 60 * 60,
   }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

   server.listen(3000);

app.get("/a",function(req,res){

  var cc = new Cm();
  Cm.findOne({ssid:req.sessionID},function(err,obj){
    if(obj === null){
      console.log("nullだよーいれるよー");
      cc.ssid = req.sessionID;
      cc.save(function(err){
        if(err){console.log(err);}
      });
    }
  });
    res.send("kid");
});

  var result ="aaa";
app.get("/e",function(req,res){
  var cc = new Cm();

  Cm.find({ssid:req.sessionID},function(err,obj){
    if(obj === null){
      console.log("存在しません");
      result = "存在しません";
    }else{
      console.log("存在します");
      result = "id番号は⇨⇨⇨" + obj[0]._id;
      console.log("id番号は⇨⇨⇨" + obj[0]._id);

    }
    console.log(result);
    res.render("test0521a");
  });

});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
