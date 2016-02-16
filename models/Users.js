var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var userSchema = new mongoose.Schema({
    _id: String,
    password: String, //hash created from password
    displayName: String,
    provider: {type: String, default: "Local"},
    created_at: {type: Date, default: Date.now},
    last_logged: {type: Date, default: Date.now},
    following: [{ type: String, ref: 'User' }],
    followers: [{ type: String, ref: 'User' }],
    posts: [{
      id: {type: Schema.Types.ObjectId},
      created_at: {type: Date, default: Date.now},
      text: String
   }]
});

userSchema.plugin(findOrCreate);
mongoose.model('User', userSchema);
