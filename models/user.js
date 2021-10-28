const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost/nodeauth',{useNewUrlParser:true})
    .then(()=> console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...',err));


// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage:{
		type: String
	}
});

const User = mongoose.model('User', UserSchema);

function getUserById(id,callback){
	User.findById(id,callback);
}

function getUserByUsername(username,callback){
	const query = {username:username};
	User.findOne(query,callback);
}
function comparePassword(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
		callback(null,isMatch);
	})
}

exports.User = User;
exports.getUserById = getUserById;
exports.getUserByUsername = getUserByUsername;
exports.comparePassword = comparePassword;