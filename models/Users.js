var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    displayName: String,
    created_at: {type: Date, default: Date.now},
    last_logged: {type: Date, default: Date.now},
});

mongoose.model('User', userSchema);
