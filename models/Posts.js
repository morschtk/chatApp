var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');

var postSchema = new mongoose.Schema({

});

mongoose.model('Post', postSchema);
