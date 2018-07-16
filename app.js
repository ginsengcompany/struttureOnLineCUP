var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
var logger = require('morgan');

var routes = require('./routes/index');
var users = require('./routes/users');
var registrazione = require('./routes/registrazione');
var menu = require('./routes/menu');
var rubrica = require('./routes/rubrica');
var prenotazione = require('./routes/prenotazione');
var appuntamenti = require('./routes/appuntamenti');
var verificaContenutoImpegnativa = require('./routes/verificaContenutoImpegnativa');
var home = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/registrazione', registrazione);
app.use('/menu', menu);
app.use('/prenotazione', prenotazione);
app.use('/rubrica', rubrica);
app.use('/appuntamenti', appuntamenti);
app.use('/verificaContenutoImpegnativa',verificaContenutoImpegnativa);
app.use('/home',home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Page not found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.title = "e-cupt";
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
