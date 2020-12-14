const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
const MongoClient = require('mongodb').MongoClient;
var db;
MongoClient.connect('mongodb+srv://yanjinho:@wjddn0317@cluster0.5tkqz.mongodb.net/tudoapp?retryWrites=true&w=majority',{useUnifiedTopology: true}, function(err,client){
    if(err) return console.log(err);
    
    db = client.db('tudoapp');

    app.listen(3000, function(req,res){
        console.log('hello!');
    });
    
});

app.get('/', function(req,res){
    res.sendfile(__dirname + '/index.html');
});

app.get('/write', function(req,res){
    res.sendFile(__dirname + '/write.html');
});

app.post('/add',function(req,res){
    res.send("전송 완료!");
    db.collection('counter').findOne({name : '게시물 갯수'}, function(err, result){
        console.log(result.totalPost);
        var totallist = result.totalPost;

        db.collection('post').insertOne({_id : totallist + 1, 제목 : req.body.title, 날짜 :req.body.date}, function(err,reuslt){
            console.log('전송완료'); // $set = 아예 설정해버리는거 $inc는 증가시키는것
            db.collection('counter').updateOne({name : '게시물 갯수'},{$inc /*오퍼레이터*/ : {totalPost : 1}},function(err,result){
                if(err) return console.log(err);
            })
        });

    });
});



app.get('/list', function(req,res){
    db.collection('post').find().toArray(function(err,result){
        console.log(result);
        res.render('list.ejs',{ posts : result});
    });//데이터를 다 찾을때
    
});


