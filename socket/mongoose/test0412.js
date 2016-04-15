var app = require('express')();
var server = require('http').Server(app);
//これをつけることが非常に重要みたいな？
var express = require('express');
var session = require('express-session');  // Session 機能
//var MongoStore = require('connect-mongo')(session);

var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var io = require('socket.io')(server);


//▪️▪️mongoose覚書！！***********************************
//参考url  http://krdlab.hatenablog.com/entry/20110317/1300367785

//mongoose使いますよ宣言
var mongoose = require('mongoose');
// 定義フェーズ　スキーマ使いますよ宣言
var Schema   = mongoose.Schema;

//スキーマはこのような型でいきますよ宣言
var UserSchema = new Schema({
  name:  String,
  point: Number,
  socketID:String,
  view:Number,
  date: { type: Date, default: Date.now }
});



//mongodbはこれでつなぎますよ宣言　DBまで指定（例：test)
mongoose.connect('mongodb://192.168.33.72/test');
//collection名はこれ（例：User333)でいきますよ宣言
//スキーマはここで使っているので、その前に 定義しておく必要あり
mongoose.model('User333', UserSchema);

//


//userオブジェクトのプロパティにどんどん値を！






//オブジェクトにsave（おそらく既定のメソッド）で mongo に insertを実行
//user オブジェクトのプロパティに入れていたものをどんどんDBに入れていく
// user.save(function(err) {
//   if (err) { console.log(err); } else{console.log("successful!!!!!!!!!!!");};
//
// });
//でこんな感じになってる　↓
//   > db.user333.find();
//    { "_id" : ObjectId("570e43c6fd1bb7d9704c8724"), "point" : 777, "name" : "KrdLab", "__v" : 0 }

//▪️▪️mongoose覚書！！***********************************




app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');
server.listen(3000);
//ああ、ロードしてくれという処理なんだ下のは！
//対象はcssとか読み込んで！っていったやつだ。きっと
//多分、sendfileは無理！
 app.use(express.static(__dirname + "/public"));
  //app.use(express.cookieParser("hogehoge"));
  app.use(cookieParser("testaerq"));//これによってデベロッパーツールでみたときに暗号化されたのを確認

//secret:"秘密の暗号化文字列"
 app.use(session({
   secret:'foo',
   key:"bbb",
   ttl:14 * 24 * 60 * 60,
  }));



app.get('/', function (req, res) {
  //console.dir(req.session);
  res.sendfile(__dirname + '/indexa.html');

  if(req.session.view){
    req.session.view++;
  }else{
    req.session.view = 1;
  }
  console.log( "中身は" + req.session.view);
  console.log("リファレンスみたらsessionIDなる⇨" + req.sessionID);

  var User = mongoose.model('User333');
  var user = new User();
    user.socketID = req.sessionID;
    user.view = req.session.view;
    user.date = new Date;
    user.point = 3456;

  user.save(function(err) {
    if (err) { console.log(err); } else{console.log("socketIDが入っているはず");};
  });

  //cookieの入れ方はこう
 res.cookie("test","testtest",{signed:true});
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
