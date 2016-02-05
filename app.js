//подключаем express
var express = require('express');
var http = require('http');
var path = require('path');
var errHandler = require('errorhandler');
var fs = require('fs');
var winston = require('winston');
var config = require('./config/');
var favicon = require('serve-favicon');
var logger = require('express-logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var router = express.Router();

//создаем приложение
var app = express();

//Middleware
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger({
    "path": __dirname + '/libs/logfile.txt'
}));
app.use(bodyParser());  //req.body...
app.use(cookieParser());    //req.cookies...
//app.use(session());
app.use(router);    //позволяет удобно говорить какие запросы как будут обработанны

app.get('/', function(req, res, next){
    res.render('index',{
        body: '<h1>Hello!</h1>',
        title: 'Hello, you!'
    });
});

//если ни один middleware не обработал запрос, то управление передаются сюда. 
//Этот mw ищет в директоии public подходящий файл
app.use(express.static(path.join(__dirname, 'public')));


//шаблонизаторы
app.set('views', __dirname + '/templates');
app.set("view engine", 'ejs');

//вешаем http-server
http.createServer(app).listen(config.get('port'), function(){
    //console.log("Express server listenning on port " + app.get('port'));
    winston.log('info', 'Express server listenning on port ' + config.get('port'));
    winston.info("launched");
});

//middleware


//если у функции 4 аргумента, то это обработчик ошибок
app.use(function(err, req, res, next){
    if(app.get('env') === 'development'){
        errHandler (err, req, res, next);
    } else {
        res.send(500);
    }
});


/*
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var http = require('http');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.favicon());
app.use(express);

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/


module.exports = app;
