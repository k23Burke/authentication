var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noexcuses');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));
var bcrypt = require('bcrypt-nodejs');

var Player, Team, User, Organization, Event, Role;
var Schema = mongoose.Schema;
//PLAYER
	var playerSchema = new Schema({
		firstName: String,
		lastName: String,
		number: Number,
		title: String,
		team_id: String,
		position: String,
		user_id: String,
		roleId: String,
		admin: {type:Boolean, default: false},
		team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}
	})

//ROLE 
	var roleSchema = new Schema({
		name: String,
		description: String,
		playerId: String
	})

//TEAM
	var teamSchema = new Schema({
		name: String,
		mascot: String,
		location: String,
		players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}]
	})

//ORGANIZATION
	var organizationSchema = new Schema({
		name: String,
		location: { type: [Number], index: '2dsphere'}, //geo tag
		teams: [String]
	})

//USER
	var userSchema = new Schema({
		username: String,
		email: {type: String, required: true, index: { unique: true }},
		password: {type: String, required: true },
		admin: {type: Boolean, default: false },
		player: {type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
	})
	userSchema.methods.generateHash = function(password) {
		console.log('password', password);
		console.log('bcrypt', bcrypt);
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	}
	userSchema.methods.validPassword = function(password) {
		console.log('USER', this);
		console.log('PASSWORD', this.password);
		return bcrypt.compareSync(password, this.password);
	}

//EVENT
	var eventSchema = new Schema({
		title: String,
		date: {type: Date, default: Date.now },
		location: String,
		notes: String
	})



User = mongoose.model('User', userSchema);
Team = mongoose.model('Team', teamSchema);
Player = mongoose.model('Player', playerSchema);
Role = mongoose.model('Role', roleSchema);
Organization = mongoose.model('Organization', organizationSchema);
Event = mongoose.model('Event', eventSchema);

module.exports = {
	User: User,
	Team: Team,
	Player: Player,
	Role: Role,
	Organization: Organization,
	Event: Event
}