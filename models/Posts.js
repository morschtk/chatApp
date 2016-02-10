var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var postSchema = new mongoose.Schema({
	created_by: { type: Schema.ObjectId, ref: 'User' },
	created_at: {type: Date, default: Date.now},
	text: String
});

mongoose.model('Post', postSchema);
