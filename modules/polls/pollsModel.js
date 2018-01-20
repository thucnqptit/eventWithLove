const mongoose = require('mongoose');
const pollsSchema = require('./pollsSchema');
const eventsSchema = require('../events/eventsSchema');
let eventsModel = mongoose.model('events', eventsSchema);
let pollsModel = mongoose.model('polls', pollsSchema);

var getPollsOnPage = function (req, res) {
        var page = req.query.page || 1;
        pollsModel.find()
            .populate('answers')
            .sort({created_at: -1})
            .skip((page - 1) * 20)
            .limit(20)
            .exec(function (err, polls) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: polls
                    });
                }
            });
}
var getPolls = function (req, res) {
        pollsModel.findOne({id: req.query.id})
            .populate('answers')
            .exec(function (err, poll) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: poll
                    });
                }
            });
}
var getNumberOfPolls = function (req, res) {
        pollsModel.count()
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
var addPoll = function(req, res) {
          var polls = new pollsModel({
            question : req.body.question
          });
          polls.save(function (err) {
              if (err) res.json({code: 0, error: err});
              else {
                var eventsId = req.body.eId;
                console.log(eventsId);
                     eventsModel.findOne({_id: eventsId})
                     .populate('processes')
                     .populate('polls')
                     .populate('questions')
                     .exec( function (err, events) {
                         if (err) res.json({code: 0, error: err});
                         else if (!events) res.json({code: 2, error: 'khong tim thay su kien'});
                         else {
                            events.polls.push(polls._id);
                             events.save(function (err) {
                                 if (err) res.json({code: 0, error: err});
                                 else{
                                     res.json({code: 1, result: events});
                                 }
                             });
                         }
                     });
              }
          });
      }
var editPoll = function (req, res) {
  var pollId = req.query.pId;
       pollsModel.findOne({_id: pollId}, function (err, poll) {
           if (err) res.json({code: 0, error: err});
           else if (!poll) res.json({code: 2, error: 'khong tim thay cau hoi'});
           else {
              var question = req.query.question;
              if(question) polls.question = question;
               polls.save(function (err) {
                   if (err) res.json({code: 0, error: err});
                   else{
                       res.json({code: 1, result: poll});
                   }
               });
           }
       });
}

const getPollById = (id, callback) => {
  pollsModel.findOne({'_id' : id}, (err, doc)=> {
    if(err) {
      res.send(err);
    } else{
      callback(null, doc);
    }
  }).populate('answers');
};
module.exports = {
  addPoll,
  editPoll,
  getPollsOnPage,
  getNumberOfPolls,
  getPollById,
  getPolls
}
