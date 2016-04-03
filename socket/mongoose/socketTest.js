var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
//mongoose.connect('mongodb://192.168.33.72/nodedb',function(err,db){
   mongoose.connect('mongodb://192.168.33.72/nodedb');

   var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("コネクトしたー");
});
//  console.log(db);
//  var ttestSchema = mongoose.Schema({ name : String  });

  //Schemaで指定したオブジェクトのプロパティ　表示させたいならここを指定する必要あり？
    var ttestSchema = mongoose.Schema({comment:String,plus:Number,time:Date,name:String,score:Number});

 //何をやっているのだろう。???   modelの役割　collection指定？
 //この後に命令書くよーっと。でスキーマ使うよーとしている？
  var ttest = mongoose.model('users3', ttestSchema);


//このfindの{}に条件を入れれば、それが取得される
  ttest.find({name:"aa"},function(err,item){
    if(err) return console.error(err);
    console.dir(item[1].name);
    console.dir(item);
  });

  User = mongoose.model('users3');
  var user = new User();
  user.name = "kakaka";

user.save(user,function(err,item2){
  console.log(item2);
});

  // db.collection("ttest",function(err,collection){
  //     var stream = collection.find().stream();
  // });



  ttest.find(function(err,docs){
      console.log("この↓に何が表示されるのか   jk");
      console.dir(docs);
  });

  console.log("connect to db");



server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/socketT.html');
});

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
