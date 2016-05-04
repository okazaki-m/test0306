var app = require('express')();
var server = require('http').Server(app);
//これをつけることが非常に重要みたいな？
var express = require('express');
var session = require('express-session');  // Session 機能
var cookieParser = require('cookie-parser');
var io = require('socket.io')(server);
//post って変数を使うの中に入っているのは、ファイルパスでしたーとsss
var post = require("./routes/temp");

//postする際の鍵１
var bodyParser = require('body-parser');

//mongoose使いますよ宣言
var mongoose = require('mongoose');
// 定義フェーズ　スキーマ使いますよ宣言
var Schema   = mongoose.Schema;
//スキーマはこのような型でいきますよ宣言
var UserSchema = new Schema({
  name:  String,
  view:Number,
  score:Number,
  date: { type: Date, default: Date.now }
});
//最後に書くとコピペするの忘れるのでこっちが良い
server.listen(3000);

//mongodbはこれでつなぎますよ宣言　DBまで指定（例：test)
mongoose.connect('mongodb://192.168.33.72/test');
//collection名はこれ（例：View)でいきますよ宣言
//スキーマはここで使っているので、その前に 定義しておく必要あり
mongoose.model('View', UserSchema);
//▪️▪️mongoose　　宣言部分！！***********************************
//view フォルダを見ます。のあとなければしたの処理に従って、publicフォルダを見ます。
app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');


//postする際の鍵２
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



//覚書 ejs は res.render("ファイル名");
 app.use(express.static(__dirname + "/public"));//express の便利な命令　⇨この中にそのファイル名があれば読み込みます
 app.use(cookieParser("testaerq"));//これによってデベロッパーツールでみたときに暗号化されたのを確認
//secret:"秘密の暗号化文字列"
  app.use(session({
    secret:'foo',
    key:"bbb",
    ttl:14 * 24 * 60 * 60,
   }));

app.param("id",function(req,res,next,id){
  req.params.id = id;
  next();
});

//ここからしたがpostの部分

app.get("/a",function(req,res){
  res.render("create2");
});

app.post("/b",function(req,res){
  res.send(req.body.name);
});
