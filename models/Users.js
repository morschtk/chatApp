var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var userSchema = new mongoose.Schema({
    username: String,
    password: String, //hash created from password
    displayName: String,
    provider: {type: String, default: "Local"},
    created_at: {type: Date, default: Date.now},
    last_logged: {type: Date, default: Date.now},
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{
      id: { type: Schema.ObjectId },
      created_at: {type: Date, default: Date.now},
      text: String
   }]
});

userSchema.plugin(findOrCreate);
mongoose.model('User', userSchema);
