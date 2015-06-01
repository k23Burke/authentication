var express = require('express'),
	path = require('path'),
	passport = require('passport'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	swig = require('swig');
var LocalStrategy = require('passport-local').Strategy;

app = express();
swig.setDefaults({cache : false});

require('./config/passport')(passport);
//routes
var basic = require('./routes');
var home = require('./routes/home');
// var authenticated = require('./routes/')

app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(session({ secret: 'keepitahunnid' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', basic);
//check auth
app.use(isAuthenticated);
//logged in stuff
app.use('/home', home);

app.listen(3337);
console.log('Listening at 3337');




function isAuthenticated(req, res, next) {
	console.log('isAuthenticated');
	if(!req.session.passport.user) {
		console.log('NO');
		res.redirect('/login/first')//, {message: 'You must log in first!'});
	} else {
		console.log('YES');

		return next();
	}
}