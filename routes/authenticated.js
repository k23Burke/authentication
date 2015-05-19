var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');

router.use('/', function(req, res, next) {
	isAuthenticated(req, res, next);
})

function isAuthenticated(req, res, next) {
	console.log('isAuthenticated');
	if(!req.session.passport.user) {
		console.log('NO');
		res.redirect('/login');
	} else {
		console.log('YES');

		return next();
	}
}

 module.exports = isAuthenticated;