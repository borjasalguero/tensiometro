var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SampleSchema = new Schema({
  owner: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  sistolic: {
    type: Number,
    required: true
  },
  diastolic : {
    type: Number,
    required: true
  },
  rpm: {
    type: Number,
    required: true
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Sample', SampleSchema);