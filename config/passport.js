var LocalStrategy = require('passport-local').Strategy;

var Models = require('../models');
var bodyParser = require('body-parser');


module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Models.User.findById(id, function(err, user) {
			done(err, user);
		})
	})

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			Models.User.findOne({email : email}, function(err, user) {
				if (err) { return done(err); }
				if (user) {
					return done(null, false, { message: 'Email Already in use!' });
				} else {
					if(req.body.teamId) {
						newPlayer = new Models.Player();
						newPlayer.team = req.body.teamId;
						newPlayer.save(function(err, player) {
							if(err) throw err
							var newUser = new Models.User();
							newUser.email = email;
							newUser.password = newUser.generateHash(password);
							newUser.player = player.id
							newUser.save(function(err) {
								if(err) throw err
								Models.Team.findOne({_id : req.body.teamId}, function(err, team) {
									team.players.push(player.id);
									team.save(function(err, theteam) {
										if(err) throw err
										return done(null, newUser)
									})
								})
							})
						})
					} else {
						newPlayer = new Models.Player();
						newTeam = new Models.Team();
						newTeam.save(function(err, team) {
							if(err) throw err
							newPlayer.team = team.id;
							newPlayer.save(function(err, player) {
								if(err) throw err
								var newUser = new Models.User();
								newUser.email = email;
								newUser.password = newUser.generateHash(password);
								newUser.player = player.id
								newUser.save(function(err) {
									if(err) throw err
									team.players.push(player.id);
									team.save(function(err, theteam) {
										if(err) throw err
										return done(null, newUser)
									})
								})
							})
						})
					}
				}
			})
		})
	}
	))

	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		Models.User.findOne({ email : email}, function(err, user) {
			console.log('USER', user);
			if(err) return done(err);
			if(!user) return done(null, false, {message : 'No user found'});
			if(!user.validPassword(password)) return done(null, false, {message: 'Wrong Password'});

			return done(null, user);
		})
	}


	))
}