var express = require('express');
var router = express.Router();
var models = require('../models');
var passport = require('passport');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Ab8wGiIipPk6wt6xRKE8lg');
// router.use('/', function(req, res, next) {
// 	console.log(req.session.passport.user)
// 	console.log('result', !req.session.passport.user)
// 	if(!req.session.passport) {
// 		return next(new Error('NOT LOGGED IN'))
// 	} else {
// 		return next();
// 	}
// })

router.get('/', function(req, res, next) {
	var uId = req.session.passport.user
	models.User.findOne({_id: uId}).populate('player').exec(function(err, user) {
		var pId = user.player._id;
		console.log('USER', user);
		console.log('PLAYER _ID', pId);
		models.Player.findOne({_id: pId}, function(err, player) {
			res.render('profile', {player: player, loggedin: true})
		})
	})
})

router.get('/team/create', function(req, res, next) {
	var uId = req.session.passport.user
// //utilizing getPlayerId
// 	getPlayerId(uId, function(err, pId) {
// 		models.Team.find({players : { $in : [pId]}}, function(err, teams) {
// 			console.log(teams);
// 			res.render('teaminfo', {team : teams[0]})
// 		})
// 	})
	models.User.findOne({_id: uId}).populate('player').exec(function(err, user) {
		var pId = user.player._id;
		if(err) return next(err)
		models.Team.find({players : { $in : [pId]}}, function(err, teams) {
			console.log(teams);
			res.render('teaminfo', {team : teams[0], loggedin: true})
		})
	})
})

router.post('/team/save', function(req, res, next) {
	var data = req.body;
	models.Team.findOne({_id : data.id}, function(err, team) {
		team.name = data.name;
		team.mascot = data.mascot;
		team.save(function(err, theTeam) {
			if(err) return next(err)
			theTeam.populate('player', function(err, popTeam) {
				if(err) return next(err)
				console.log('TheTeam', popTeam);
				res.render('teamhome', {team : popTeam, loggedin: true})
			})
		})
	})
})


router.get('/team', function(req, res, next) {
	var uId = req.session.passport.user;
	models.User.findOne({_id: uId}).populate('player').exec(function(err, user) {
		if(err) return next(err)
		var pId = user.player._id;
		models.Team.find({players : { $in : [pId]}}).populate('players').exec(function(err, teams) {
			if(err) return next(err)
			console.log(teams);
			res.render('teamhome', {team : teams[0], loggedin: true})
		})
	})
})

router.post('/editplayerinfo', function(req, res, next) {
	console.log(req.body);
	models.Player.findOne({_id: req.body.profileId}, function(err, player) {
		console.log('PLAYER', player);
		player.firstName = req.body.first;
		player.lastName = req.body.last;
		player.number = req.body.number;
		player.title = req.body.title;
		player.position = req.body.position;
		player.save(function(err, newplayer) {
			if(err) return err;
			res.redirect('/home');
		})
	})
})

router.get('/invite', function(req, res, next) {
	res.render('invite')
})

router.post('/invite', function(req, res, next) {
	console.log('USER_ID', req.session.passport.user)
	var invArr = req.body.emailforInvite.split(', ');
	getTeamIdFromUser(req.session.passport.user, function(err, teamId) {
		invArr.forEach(function(email) {
			return sendEmail(email, 'leader@noexcuses.com', 'You Have been Invited', teamId);
		})
		res.render('invite')
	})
})

router.get('/event', function(req, res, next) {
	res.render('eventlist')
})

router.get('/event/new', function(req, res, next) {
	res.render('eventinfo')
})
router.post('/event/create', function(req, res, next) {
	console.log(req.body);
	var newEvent = new models.Event();
	newEvent.title = req.body.title;
	determineTimes(req.body);
})

 module.exports = router;

function determineTimes(data) {
	var starthour = parseInt(data.hourStart);
	data.startHalf === 'PM' ? hour += 12 : console.log('In AM')
	var startmin = parseInt(data.minuteStart);

	var startDate = new Date();
	startDate.setMonth(data.month);
	startDate.setDate(data.day);
	startDate.setHours(starthour);
	startDate.setMinutes(startmin);
	console.log(startDate)
}

function getPlayerId(userId, cb) {
	models.User.findOne({_id: userId}).populate('player').exec(function(err, user) {
			if(err) return cb(err, null);
			return cb(err, user.player._id)
	});
}

function getTeamIdFromUser(userId, cb) {
	getPlayerId(userId, function(err, pId){
		models.Team.find({players : { $in : [pId]}}).populate('players').exec(function(err, teams) {
			if(err) return cb(err, null);
			else return cb(err, teams[0]._id);
		})
	})
}


function sendEmail(to_email, from_email, subject, teamId){
	var html = "<html><head><meta charset='utf-8'></head>";
		html+= "<body><p>Hey Teammate,</p>";
		html+= "<br><p>Please follow the link below to sign up for No Excuses. It will keep all of us on the same page throughout the season, auto-update schedule changes, and much more!</p>";
		html+= "<p><a href='localhost:3337/invited/"+teamId+"'>asdfghj</a></p>";
		html+= "<p><b>NO EXCUSES</b></p></body></html>";
		console.log(html);
  var message = {
      "html": html,
      "subject": subject,
      "from_email": from_email,
      "from_name": '',
      "to": [{
              "email": to_email,
              "name": ''
          }],
      "important": false,
      "track_opens": true,    
      "auto_html": false,
      "preserve_recipients": true,
      "merge": false,
      "tags": [
          "Invite to Team"
      ]    
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
      // console.log(message);
       console.log(result);   
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
  });
}