var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require("./models/index.js");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var routes = require('./routes');
const session = require('express-session');

var app = express();

app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 250 * 60 * 60 //15분
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

models.sequelize.sync().then( () => {
  console.log("Connected to DB");
}).catch(err => {
  console.log("Connect failed to DB");
  console.log(err);
})

  const { spawn } = require('child_process');
  const childPython = spawn('python',['../Python/test_schedule/Guild_List_Load.py']);

  childPython.stderr.on('data',(data) => {
    console.error(`stderr: ${data}`);
  });
  childPython.on('close', (code) => {
    console.log(`child process1 exited with code ${code}`);
  });

  const childPython2 = spawn('python',['../Python/test_schedule/Test_DB.py']);
  childPython2.stderr.on('data',(data) => {
    console.error(`stderr: ${data}`);
  });
  childPython2.on('close', (code) => {
    console.log(`child process2 exited with code ${code}`);
  });

  const childPython3 = spawn('python',['../Python/test_schedule/Test_Update.py']);
  childPython3.stderr.on('data',(data) => {
    console.error(`stderr: ${data}`);
  });
  childPython3.on('close', (code) => {
    console.log(`child process3 exited with code ${code}`);
  });




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
