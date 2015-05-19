var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');


router.get('/', function(req, res, next) {
	console.log(req.session);
	res.render('index')
})

router.get('/signup', function(req, res, next) {
	res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup', {
	successRedirect : '/home/team/create',
	failureRedirect : '/signup'
}));

router.get('/login/first', function(req, res, next) {
	res.render('login', {message : 'You must log in first!'})
})

router.get('/login', function(req, res, next) {
	res.render('login')
})

router.post('/login', passport.authenticate('local-login', {
	successRedirect : '/home',
	failureRedirect : '/login'
}))

router.get('/invited/:id', function(req, res, next) {
	console.log(req.params.id);
	res.render('signup', {teamId: req.params.id})
})

 module.exports = router;