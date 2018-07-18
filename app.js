let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let logger = require('morgan');
let session = require('express-session');
let request = require('request');
let aziende = require('./utils/aziende');

let index = require('./routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "534153484568198!!!!",
    saveUninitialized: false,
    resave: false
}));

function checkauth(req, res, next) {
    if(req.url.includes('home') || req.url.includes('prenotazione') || req.url.includes('rubrica') || req.url.includes('appuntamenti') || req.url.includes('logout')){
        if (!req.session || !req.session.auth){
            res.redirect('login');
        }
        else
            next();
    }
    else
        next();
}

app.use(checkauth);
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
