var express = require('express'); //express module
var router = express.Router();
var mysql = require('mysql'); //mysql module
//var app = express();
var bcrypt = require('bcrypt-nodejs');  //bcrypt-nodesjs module
var path = require('path');

//Bodyparser in express
router.use(express.json());
router.use(express.urlencoded({extended: false}));

router.use(express.static(path.join(__dirname + '/.'))); //css

//Load html
router.get('/', function(req, res){
  res.sendFile(__dirname + '/Views/step_login.html');
});

//Connect DB
var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'gkatn0512',
  database   : 'test1',
  //port      : '3000'
});

connection.connect(); //Connect to DB

//Login DB
//계정생성함
bcrypt.hash('carpedm', null, null, function(err, hash){
  var qry = 'INSERT IGNORE INTO account (ID, Password) values(?, ?)';
  var params = ['carpediem', hash];
  console.log(hash);
  connection.query(qry, params, function(err, rows){
    if(err) console.log("Start Error");
    else console.log("Success to make carpediem");
  });
});

//테이블 보고싶으면 쓸것
/*
var qry = 'Select * from account';
connection.query(qry, function(err, rows){
  if(err) console.log(err);
  else{
    console.log(rows);
  }
});
*/

//Do Login
router.post('/login_user', function(req,res){
    var user_ID = req.body.login_ID;
    var user_PW = req.body.login_Password;
    var login_qry = 'SELECT * FROM account WHERE ID = ?';

    connection.query(login_qry, user_ID, function(err, rows, fields){
      if(err) console.log('Error Log Query');
      else{ //OK
        if(rows[0] != undefined){ //Not Empty
          console.log(rows[0].Password);
          console.log(user_PW);

          if(!bcrypt.compareSync(user_PW, rows[0].Password))
            console.log('Wrong Password');
          else{
            console.log('Correct');
            console.log('https://' + req.headers.host + req.url);
            //res.redirect('https://' + req.headers.host);
            res.sendFile(__dirname + '/Views/main.html');
          }
        }
        else{ //Empty or Wrong
          console.log('There is no exists ID');
        }
      }
    });
    res.sendFile(__dirname + '/Views/step_login.html');
    connection.end();
});

/*
router.listen(3000, function(){
  console.log('Connected 3000 port!');
});
*/
