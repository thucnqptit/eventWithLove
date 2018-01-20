const mongoose = require('mongoose');
const questionsSchema = require('./questionsSchema');
const eventsSchema = require('../events/eventsSchema');
let questionsModel = mongoose.model('questions', questionsSchema);
let eventsModel = mongoose.model('events', eventsSchema);
var getQuestionsOnPage = function (req, res) {
        var page = req.query.page || 1;
        questionsModel.find()
            .sort({created_at: -1})
            .skip((page - 1) * 20)
            .limit(20)
            .exec(function (err, questions) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: questions
                    });
                }
            });
}
var getQuestions = function (req, res) {
        questionsModel.findOne({id: req.query.id})
            .exec(function (err, question) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: question
                    });
                }
            });
}
var getNumberOfQuestions = function (req, res) {
        questionsModel.count()
            .exec(function (err, c) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: c
                    });
                }
            });
    }
var addQuestion = function(req, res) {
          var questions = new questionsModel({
            content : req.body.content
          });
          questions.save(function (err) {
              if (err) res.json({code: 0, error: err});
              else {
                var eventId = req.query.eId;
                     eventsModel.findOne({_id: eventId}, function (err, event) {
                         if (err) res.json({code: 0, error: err});
                         else if (!event) res.json({code: 2, error: 'khong tim thay cau hoi'});
                         else {
                            events.questions.push(questions._id);
                            events.save(function (err) {
                                 if (err) res.json({code: 0, error: err});
                                 else{
                                     res.json({code: 1, result: event});
                                     // res.json({code: 1, result: questions});
                                 }
                             });
                         }
                });
              }
          });
      }
var editQuestion = function (req, res) {
  var questionsId = req.query.qId;
       questionsModel.findOne({_id: questionsId}, function (err, question) {
           if (err) res.json({code: 0, error: err});
           else if (!question) res.json({code: 2, error: 'khong tim thay cau hoi'});
           else {
              var content = req.query.content;
              if(content) question.content = content;
               questions.save(function (err) {
                   if (err) res.json({code: 0, error: err});
                   else{
                       res.json({code: 1, result: question});
                   }
               });
           }
       });
}

const getQuestionById = (id, callback) => {
  questionsModel.findOne({'_id' : id}, (err, doc)=> {
    if(err) {
      res.send(err);
    } else{
      callback(null, doc);
    }
  });
};
module.exports = {
  addQuestion,
  editQuestion,
  getQuestionsOnPage,
  getNumberOfQuestions,
  getQuestionById,
  getQuestions
}
