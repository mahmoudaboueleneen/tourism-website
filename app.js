var express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var app = express();
const { isObject } = require('util');
const url = require('url');
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('NotSoSecret'));
const sessionTime = 1000*60*60*4;
app.use(session({
  secret: 'Secret key',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: sessionTime  }
}))
app.use(flash());

// Users Login


app.get('/', function(req, res){
  var a=0;
  var queryObj = url.parse(req.url,true).query
  // if(queryObj.again!=null)
       if(req.session.regDone){
          a = 3
       }else if(req.session.emptyUorP){
          a = 2
       }
       else if(req.session.wrongUorP){
          a = 1
       }
  req.session.destroy();
  //console.log(a);
  res.render('login',{again:a});
});


app.post('/', function(req, res){
  //check if credentials match database
   var u = req.body.username;
   var p = req.body.password;
  if(u==""||p==""){
    //console.log("either is null");
    req.session.emptyUorP = true
    res.redirect('/');
    
  }

  else if(!(u==""||p=="")){
    
    MongoClient.connect("mongodb://localhost:27017/myDB", function(err, db){

      if (err) throw err;
      var dbo = db.db("myDB");

      dbo.collection("myCollection").findOne({username:u,password:p}, function(err, result) {

        if (err) throw err;

        if(result==null){
          //var myobj = { username: u, password: p };
          req.session.wrongUorP = true
          res.redirect('/');

        }else{

          req.session.username = u
          res.redirect('home');
          
          // res.redirect(url.format({
          //   pathname:"/home",
          //   query: {
          //      "user": u
          //    }
          //}));
         
        }

        db.close();

      });
        
    }); 
  }
  //if credentials are correct
    //res.render('home');
  //else
    //error message
});


// // User Registration
app.get('/registration',function(req,res){
  req.session.destroy();
  res.render('registration');
});

app.post('/registration', function(req, res){
  

  var u = req.body.username;
  var p = req.body.password;

  if(u==""||p==""){
    res.render('registration',{again:2});
  }
  else if(!(u==""||p=="")){
    MongoClient.connect("mongodb://localhost:27017/myDB", function(err, db){
      if (err) throw err;
      var dbo = db.db("myDB");

      dbo.collection("myCollection").findOne({username:u}, function(err, result) {
        if (err) throw err;
        if(result==null){
          var myobj = { username: u, password: p };
          if (err) throw err;
          var dbo = db.db("myDB");
          dbo.collection("myCollection").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });
          req.session.regDone = true;
          res.redirect(url.format({
            pathname:"/",
          }));
        }else{
        res.render('registration',{again:1});
        //alert('The username already exists'); 
        //  res.render('registration');
        db.close();
        }
      });

    
        
      
        
    }); 
  }
    //display Login was successful message
});

// Home page
app.get('/home',check,function(req, res){
  // var queryObj =  url.parse(req.url,true).query
  // var username = queryObj.user;
  // console.log(username);
  res.render('home');
});
//

// Hiking
app.get('/hiking',check, function(req, res){
 
  res.render('hiking');
});

// Cities
app.get('/cities',check, function(req, res){
  
  res.render('cities');
});

// Islands
app.get('/islands',check, function(req, res){
  res.render('islands',);
});

// Want To Go
app.get('/wanttogo',check, function(req, res){
  
  var user = req.session.username;

  MongoClient.connect("mongodb://localhost:27017/myDB", function(err, db){
      if (err) throw err;
      var dbo = db.db("myDB");

      dbo.collection("myCollection").find({username:user}).toArray(function(err, result) {
        if (err) throw err;
        res.render('wanttogo',{result});
        db.close();
      });  
    });

});


// Inca
app.get('/inca',check, function(req, res){
  if(req.session.added&&req.session.added=='done'){
    res.render('inca',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('inca');
  }
});
// Annapurna
app.get('/annapurna',check, function(req, res){
  if(req.session.added&&req.session.added=='done'){
    res.render('annapurna',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('annapurna');
  }
});
// Paris
app.get('/paris',check, function(req, res){
  if(req.session.added&&req.session.added=='done'){
    res.render('paris',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('paris');
  }
});
app.post('/paris', function(req, res){
  
});
// Rome
app.get('/rome',check, function(req, res){
  if(req.session.added&&req.session.added=='done'){
    res.render('rome',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('rome');
  }
});

// Bali
app.get('/bali',check, function(req, res){

  if(req.session.added&&req.session.added=='done'){
    res.render('bali',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('bali');
  }
});

// Santorini
app.get('/santorini',check, function(req, res){
  if(req.session.added&&req.session.added=='done'){
    res.render('santorini',{added:"Already Added"});
    req.session.added = undefined;
    req.session.save()
  }
  else{
    
    res.render('santorini');
  }
});

// Search results
app.get('/searchresults',check, function(req, res){
  res.render('searchresults');
});
app.post('/searchresults', function(req, res){
  res.render('searchresults');
});


app.post('/search',check, function(req, res){
  var user = req.session.username;

  var destinations = ["bali island","santorini island","paris","rome","inca trail to machu picchu","annapurna circuit"];
  var s = req.body.Search.toLowerCase();
  var searchRes = [];
  var found = false;
  for(let i = 0; i < destinations.length; i++){
    if(destinations[i].includes(s)){
      searchRes.push(destinations[i]);
      found = true;
    }
  }
  if(!found)
    searchRes.push("empty");
  res.render('searchresults', {searchRes});
});

app.post('/add',check,function(req,res){

  var queryObj = url.parse(req.url,true).query;

  var user = req.session.username
  var dest = queryObj.dest;
  var flagg=0;
  var myobj = {username: user,destination: dest};

  MongoClient.connect("mongodb://localhost:27017/myDB", function(err, db){
  if (err) throw err;
  var dbo = db.db("myDB");

   dbo.collection("myCollection").findOne(myobj, function(err, result) {
    if (err) throw err;
    if(result==null){
      if (err) throw err;
       dbo.collection("myCollection").insertOne(myobj, function(err) {
        if (err) throw err;
        
        db.close();
        
      });
    }else{
      req.session.added = 'done'
      req.session.save();
      db.close();
      
    }
    
  });
  
  }); 
  setTimeout(function() { res.redirect(dest); }, 10)
  
});

// var x = {name: "Ali", age: 27, username: "ali92", password: "abc123"};
// var y = JSON.stringify(x);
// fs.writeFileSync("users.json", y);

// var data = fs.readFileSync("users.json");
// var z = JSON.parse(data);


//


 


function check(req,res,next){
  if( req.session &&req.session.username){
      next();
  }else{
    res.redirect('/')
  }
}
if(process.env.PORT) {
  app.listen(process.env.PORT, function () {console.log('Server started')});
}
else {
  app.listen(3000, function() {console.log('Server started on port 3000')});
}