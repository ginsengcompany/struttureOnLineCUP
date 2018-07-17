let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');

let index = require('./routes/index');
let rubrica = require('./routes/rubrica');
let prenotazione = require('./routes/prenotazione');
let appuntamenti = require('./routes/appuntamenti');
let verificaContenutoImpegnativa = require('./routes/verificaContenutoImpegnativa');
let home = require('./routes/home');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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
