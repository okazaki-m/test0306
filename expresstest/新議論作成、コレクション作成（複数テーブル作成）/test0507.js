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

//スキーマはこのような型でいきますよ宣言
var UserSchema = new Schema({
  name:  String,
  view:Number,
  score:Number,
  date: { type: Date, default: Date.now },
  title:String,
  memo:String
});
var fun = require("./routes/ex");
console.log(fun);

//mongodbはこれでつなぎますよ宣言　DBまで指定（例：test)
  //DB　変えたいときは　   db.connection.close(); が必要
    var db = mongoose.connect('mongodb://192.168.33.72/test');

  mongoose.model('ViewGiron2', UserSchema);//viewgiron2 のcollectionで、と
    var ViewG2 = mongoose.model('ViewGiron2'); //scemaを適用するよ、と。

  mongoose.model('ViewGiron', UserSchema);
    var ViewG = mongoose.model('ViewGiron'); //scemaを適用するよ、と。


//▪️▪️mongoose　　宣言部分！！***********************************

//view フォルダを見ます。のあとなければしたの処理に従って、publicフォルダを見ます。
app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');

//覚書 ejs は res.render("ファイル名");
 app.use(express.static(__dirname + "/public"));//express の便利な命令　⇨この中にそのファイル名があれば読み込みます
 app.use(cookieParser("testaerq"));//これによってデベロッパーツールでみたときに暗号化されたのを確認
//secret:"秘密の暗号化文字列"
  app.use(session({
    secret:'foo',
    key:"bbb",
    ttl:14 * 24 * 60 * 60,
   }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

  var aiai = 0;
app.param("id",function(req,res,next,id){
  //req.params.idid = id;
  aiai = id;
  next();
});
   server.listen(3000);
   app.get("/new",fun.bb);
   app.post("/post",function(req,res){

     //まず、ここでmongo に値をセットする
//     res.send(req.body.titlea);
    //mongoose.connect('mongodb://192.168.33.72/test2');
//    mongoose.disconnect();

//  var   db = mongoose.createConnection('mongodb://192.168.33.72/test2');
//
//    mongoose.connect('mongodb://192.168.33.72/test2');

     var vc = new ViewG2();
     vc.title = req.body.title;
     vc.memo = req.body.memo;
     vc.save(function(err){
       if(err){
         console.log(err);
       }
     });
     //var vg = new ViewG();
     ViewG2.find({},{},{sort:{date:1}},function(err,docs){
       for(var i=0,size=docs.length;i<size;i++){
         console.log("ここから何度も呼ばれて、それで見れるイメージ");
         console.log(docs[i].title + docs[i].memo + docs[i]._id);
       }
       console.log(docs);
//       res.send(docs);
       res.render("coco",{docs:docs});
//       db.connection.close();
     });

   });
app.get("/para/:id",function(req,res){
//      res.render("iddayo");
//      res.send(aiai);
      res.render("nda",{sample:aiai});
//    res.send("test" + req.params.id);
    //ここから先、そのとってきたIDを音にして、DBを検索する。
    //そして、、
  //    console.log("aiaiとは何か" + aiai);

      ctitle = "a" + aiai;
      var collec1 = ctitle;
      console.log(collec1);
      mongoose.model(collec1, UserSchema);
      var gcollec = mongoose.model(collec1); //scemaを適用するよ、と。
      var gc = new gcollec();
      gc.title = "test用タイトル";
      gc.score = 55;
//      console.log("きちんとでる？・・" + gc.title);
      gc.save(function(err){
        if(err){
          console.log(err);
        }else{
        }
      });
    console.log(req.params.id);
    //ページのフォーマットは全て一緒だけど、そこにある叩いなどは
    //そのidが持っている情報をひっぱってきて表示する
    //
    //
});



app.get("/list",function(req,res){
  //　リスト表示
   ViewG.find({},{},{sort:{date:1}},function(err,docs){
     for(var i=0,size=docs.length;i<size;i++){
       console.log(docs[i].title + docs[i].memo + docs[i]._id);
     }
     res.render("coco",{docs:docs});
   });
});
