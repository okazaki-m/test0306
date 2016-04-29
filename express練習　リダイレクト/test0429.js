var app = require('express')();
var server = require('http').Server(app);
//これをつけることが非常に重要みたいな？
var express = require('express');
var session = require('express-session');  // Session 機能
//var MongoStore = require('connect-mongo')(session);


var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var io = require('socket.io')(server);

var viewcnt = 0;

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
  time:Number,
  score:Number,
  date: { type: Date, default: Date.now }
});
//mongodbはこれでつなぎますよ宣言　DBまで指定（例：test)
mongoose.connect('mongodb://192.168.33.72/test');
//collection名はこれ（例：User333)でいきますよ宣言
//スキーマはここで使っているので、その前に 定義しておく必要あり
mongoose.model('User333', UserSchema);
//▪️▪️mongoose　　宣言部分！！***********************************

//ejsを使えるようにする工夫（middleware installは必要)
//view フォルダを見ます。のあとなければしたの処理に従って、publicフォルダを見ます。
app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');

server.listen(3000);
//ああ、ロードしてくれという処理なんだ下のは！
//対象はcssとか読み込んで！っていったやつだ。きっと
//多分、sendfileは無理！
 app.use(express.static(__dirname + "/public"));//express の便利な命令　⇨この中にそのファイル名があれば読み込みます
 //hi.html  にアクセスしてみればわかる。

  //app.use(express.cookieParser("hogehoge"));
  app.use(cookieParser("testaerq"));//これによってデベロッパーツールでみたときに暗号化されたのを確認

//secret:"秘密の暗号化文字列"
 app.use(session({
   secret:'foo',
   key:"bbb",
   ttl:14 * 24 * 60 * 60,
  }));

app.get('/memo', function (req, res) {
  res.send("表示されるよー");
});

app.get('/', function (req, res) {
  //console.dir(req.session);
  //　まずこのファイルをユーザーに送ります。
  res.sendfile(__dirname + '/indexa.html');

  if(req.session.view){
    req.session.view++;
  }else{
    req.session.view = 1;
  }
  console.log( "閲覧回数：" + req.session.view);
  console.log("リファレンスみたらsessionID があった⇨" + req.sessionID);

//▪️▪️mongoose　　データを当て込む部分！！***********************************
  var User = mongoose.model('User333'); //scemaを適用するよ、と。
  var user = new User();
    user.socketID = req.sessionID;
    user.view = req.session.view;
    user.date = new Date;
    user.point = 3456;
//▪️▪️mongoose　　データを当て込む部分！！***********************************

//任意のデータがあるのか調べる***********************************
User.find({},function(err,docs){
  if(docs == ""){
    console.log("mongoから返ってきた値はありません");
  }
        var sessCount = 0;//初期値
  for (var i=0, size=docs.length; i < size; ++i) {
      if(req.sessionID === docs[i].socketID){
        sessCount = 1;
      }
    }
    if(sessCount === 0){
      //▪️▪️mongoose　　データを投入部分！！***********************************
        user.save(function(err) {
          if (err) { console.log(err); };
          console.log(" なかったので挿入しました");
        });
      //▪️▪️mongoose　　データを投入部分！！***********************************
    }
    sessCount = 0;//初期値戻し
});//　　find　があるのかはここまでを調べて判明する


  //cookieの入れ方はこう
 res.cookie("test","testtest",{signed:true});
});

app.get('/test', function (req, res) {
  //console.log(req.sessionID);

  var User = mongoose.model('User333'); //scemaを適用するよ、と。
  var user = new User();

          //ココは countが何かしらあるはず。　書き換える予定
  User.count({socketID:req.sessionID},function(err,docs){
      if(docs === 0){
        res.send("ないです");
      }else{
        res.send("あります");
        console.log(docs);
      }
            // if(docs[0] !== undefined){
            //     console.log(docs[0].date);
            //     console.log("ありました");
            //     res.send("ありました" + docs[0].date);
            // }else{
            //   console.log("ないです");
            //     res.send("ないです");
            // }


  //        console.dir(docs[0].point);
  //        console.log("ここが何ども読み出されるのはなぜ？");

  });//　　find　があるのかはここまでを調べて判明する
  // User.find({},function(err,docs){
  //   for (var i=0, size=docs.length; i < size; ++i) {
  //       if(req.sessionID === docs[i].socketID){
  //           console.log("あった");
  //       }else{
  //           console.log("ないぞよ");
  //       }
  //     }
  // });//　　find　があるのかはここまでを調べて判明する
});//   app.get("/test")

var cntroomA = 0;

app.get('/access',function(req,res){
      viewcnt++;
      res.send("accessだよ");
    console.log("access" + viewcnt);
});

app.get('/chart',function(req,res){
      res.send("hohoho");
      console.log(viewcnt);
      var j = 0;
      sss();
      function sss(){
        var time = setTimeout(function(){
          j++;
          sss();
          console.log("hey" + j);
        },1000);

    var chartTool = mongoose.model('User333'); //scemaを適用するよ、と。
    var cha = new chartTool();
    cha.view = viewcnt;
        if(j%5 === 0){
          cha.save(function(err) {
             if (err) { console.log(err); };
                  //console.log("5秒たったので挿入");
                });
                //clearTimeout(time);
              }

            if(j===4){
              //clearTimeout(time);//25 で終了させる
              //リダイレクトがうまくいかない件
              //res.redirect('http://google.com');
            }

      };// function sss()
});

app.get("/reaa",function(req,res){
//  res.json("hai");
  res.sendfile(__dirname + '/indexa.html');
  console.log("test");

    res.sendfile(__dirname + '/indexa.html');
    console.log("aa");
    //res.send("/redirect");
});

app.get("/redirect",function(req,res){
    console.log("OK だよーーー");
    //res.send("hehehe");
    var User = mongoose.model('User333'); //scemaを適用するよ、と。
    var user = new User();
    var obja = {};
    var objb = {};
    User.find({},function(err,docs){
      // console.log(docs[1].);
      for (var ii=0,size = docs.length; ii < size; ii++){
          console.dir(docs[ii].name + "さんのscoreは"+docs[ii].score);
          obja[ii] = docs[ii].name + "さんのscoreは" + docs[ii].score;
          //objb[ii] = docs[ii].score;
        //  obja[ii] ="heyhey";
        //  console.log("ここでる？" + obja.aa);
      }

            res.send(obja);
    });

//    res.send(obja);
//    res.send(obja);
//    setTimeout(function(){
//      console.log("ldk");
//    },5000);

});

app.get("/sample",function(req,res){
      res.send("yeah!!");
      console.log("tobimasita");
});

app.get('/sam', function (req, res) {
  // console.log("とりあえずまず表示かな")；
  console.log("aとりあえずまず表示かな");
  res.send("まず　res.sendのテストだよね");
  var i = 0;
  show(); //first

  function show(){
  var ttt = setTimeout(function(){
        i++;
        show();
    },1000);
    console.log("show のテスト" + i);
    if(i > 10){
      clearTimeout(ttt);
      // res.send("２つ送るとどうなのか");
    }
    if(i === 5){
      console.log("5秒経ちました");
      var User = mongoose.model('User333'); //scemaを適用するよ、と。
      var user = new User();
//        user.name = "挿入しましたーーーーー";
        user.save(function(err) {
          if (err) { console.log(err); };
          //時間が経ったときにmongoに挿入OK!!
          console.log("5秒たったので挿入");
        });
    }
  };
});


io.on('connection', function (socket) {
  socket.broadcast.json.emit('news', { hello: 'The world2' });
  socket.on("myRoom",function(data){
      socket.join(data);
      console.log("join　した　myRoom名は；" + data);
      if(data === "roomA"){
        cntroomA++;
        console.log(cntroomA);
      }
      //このソースラインは全てのアクセスで出るものなので、
      //他roomでもここのroom に合致しているとメッセーが送られる
      //そのため、↓のようにroomを指定して出している。
      io.to(data).emit("roomtest","room test 「" + data +  "」だとでるよ");
      //io.to("roomB").emit("roomtest","room test 「roomB」だとでるよ");
  });
  socket.broadcast.json.emit('news', {my :"hello",hi:"jakljdf"});
  socket.on('my other event', function (data) {
    console.log(data);
  });
  //socket.broadcast.emit('ここをどうして・・・');
});
