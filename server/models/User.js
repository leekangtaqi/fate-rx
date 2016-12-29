'user strict';

//日志
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Mixed = Schema.Types.Mixed
  ;

var UserSchema = new Schema({
	name: String,
	score: Number,
  count: Number
});

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true,
  transform: function(doc, ret, options) {
    if (options.hide) {
      options.hide.split(' ').forEach(function (prop) {
        delete ret[prop];
      });
    }
    delete ret['_id'],delete ret['__v'];
  }
},{
  timestamps:true
}); 

module.exports = mongoose.model('User', UserSchema);
