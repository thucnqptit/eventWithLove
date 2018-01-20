const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const questionsSchema = new Schema({
  content : {
     type : String,
     required : true
  },
  author : {
    type: ObjectId,
    ref: 'events'
  }

}, { timestamps: { createdAt: 'created_at', updatedAt : 'updated_at' }} );

module.exports = questionsSchema;
