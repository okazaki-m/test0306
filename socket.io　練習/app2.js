var app = require('express')();
var server = require('http').Server(app);

//これをつけることが非常二重用？
var express = require('express');
// var app = express();

var session = require('express-session');  // Session 機能
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var fs = require('fs');
var upload = multer({dest:'uploads/'}); //ここにファイルが格納されますよと
var mediaPath = __dirname + "/uploads";
var type = upload.array('file');

app.set('views',__dirname + "/views");
app.set('view engine', 'ejs');


//var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(3000);



 app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // for parsing application/json
// app.use(multer({ dest:'./uploads/'}));//おそらくアップロードする先の指定・・・
app.use(bodyParser.urlencoded({ extended: true }));
//sessionの中身定義
app.use(session({
    key:"keydayo----",
    secret: 'okamoto',
    saveUninitialized: true,
    resave: true,
    cookie:{maxAge:60000}
}));

var cnt = 0;

 // app.use(cookieParser());
app.use(cookieParser("testaerq"));//これによってデベロッパーツールでみたときに暗号化されたのを確認

app.get('/', function (req, res) {
  if (req.session.user) {
    console.log("セッションは保持されています");
//    console.dir(req.session);
    //これでサーバ側からcookieに情報を保持させることが可能
    // res.cookie("testcookies","aaaaaa");
    var begginer = req.cookies.begginer || Math.random();
  res.cookie('begginer', begginer, { signed: true });
    console.dir("cookieに入っているsessionIDは");
  //  console.dir(req);
   console.log(req.signedCookies);//暗号化したものはこのように取り出せる

    // console.dir(req);
        // console.dir("Cookies: ", req.cookie);

}else{
  console.log("初めての訪問です。セッション情報はまだありません。");
      console.dir("Cookies: ", req.cookies);
};

var user = "okazaki";
req.session.user = {
    user: user,
    objid: "fuga"
};
  res.render('index.ejs', { title: 'Hey',message:"world!!"});
  // req.session.userID = req.connection.remoteAddress;
    // console.dir(req.session.userID);
    //abc = req.session.userID;
    //console.log(abc);
});

app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id == 0)
  next('route');
  // otherwise pass the control to the next middleware function in this stack
  else next(); //
}, function (req, res, next) {
  // render a regular page
  res.render('regular');
});
// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function (req, res, next) {
  res.render('special');
});

app.get('/giron', function (req, res, next) {
  if(req.session.user){
      res.render('exitsession');
          console.dir(req.session);
  }else{
     res.render("nosession");
      //res.render("nosession");
    //   setTimeout(
    //  res.redirect("/login")
    //  ,15000);
  }
});
app.get("/login",function(req,res,next){
  res.send("すみませんが、ログインしてください（res.sendで表現）");
});
app.get("/create",function(req,res,next){
      res.render('create');
  //  res.send("ここから下はどんな表示なのだろうか");
});
app.post("/indicate",upload.single("fileselect"),function(req,res,next){

        var media = req.file.filename;
//        console.log(__dirname + "/" + req.file.path);
      console.dir(req.file);
        var patha = __dirname + "/" + req.file.path;
        var pathb = __dirname + "/uploads/" + req.file.filename + ".png";
                fs.rename(patha,pathb);
        var pathc = "./upload/" + req.file.filename + ".png";
    //    res.render("indicate",{data:req.body,file:req.file});
      res.render("indicate",{data:req.body,file:pathc});

      //よくわからないけど、サーバ側から
      // res.json(req.body);

});
app.post('/upload', upload.array('testfile',12), function (req, res) {
  console.log(req.files);
 var media = req.files.filename;
 console.log(media);
 fs.rename(media.path,mediaPath + "media.png");

//  console.dir(req.body);
});


app.get('/a', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  //違う何かが接続する毎にこれが実行
  io.sockets.emit('news', { hello: 'なんども送られるはず' });
//  socket.broadcast.emit('news', { hello: 'world' });
 //リクエストしてきたsocket.idに対してのみ実行
  socket.emit('aiu',{helloo:"接続オンリー",sid:socket.id});


  socket.on('my other event', function (data) {
    console.log(data);
    });
    socket.on("haihai",function(data){
      console.log(data);
  });
    socket.on("eee",function(data){
        socket.join(data.room);
        io.sockets.emit("yourroom","あなたのroomは" + data.room);
        // socket.broadcast.to(data.room).emit('emit_from_server', "ああああ");
        // socket.to(data.room).emit('emit_from_server', "ああああ");
        io.to(data.room).emit('emit_from_server', "ああああ" + cnt);

        if(data.room === "room1"){
          cnt++;
        }
    })





});
