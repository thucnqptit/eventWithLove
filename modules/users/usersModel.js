const mongoose = require('mongoose');
const uuidV4 = require('uuid4');
const ls = require('local-storage');
const request = require('request');
const usersSchema = require('./usersSchema');

let usersModel = mongoose.model('users', usersSchema);

var login =  function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        usersModel.findOne({username: username})
            .exec(function (err, user) {
                if (err) {
                    res.json({code: 0, error: err});
                }
                else if (!user) {
                    res.json({code: 2, error: 'Sai tên đăng nhập'});
                }
                else if (user.password !== password) {
                    res.json({code: 3, error: 'Sai mật khẩu'});
                }
                else {
                    res.json({
                        code: 1,
                        access_token: user.access_token,
                        user: user
                    });
                    // ls.set('at', user.access_token)
                }
            });
    }
    var loginFB =  function (req, res) {
        var at = req.body.at;
        request('https://graph.facebook.com/v2.11/me?access_token=' + at, { json: true }, (err, res, body) => {
              if (err) { return console.log(err); }
              console.log(body.url);
              console.log(body.explanation);
            });
        }

var logout =  function (req, res) {
        var userId = req.user._id;
        usersModel.update(
          {_id: userId},
          {access_token: uuidV4()},
          function (err) {
            if (err) res.json({code: 0, error: err});
            else {
                req.user = undefined;
                res.json({code: 1 });
            }
        });
}


var getUsersOnPage = function (req, res) {
        var page = req.query.page || 1;
        usersModel.find()
            .populate('events')
            .sort({created_at: -1})
            .skip((page - 1) * 20)
            .limit(20)
            .exec(function (err, users) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: users
                    });
                }
            });
}
var getUsers = function (req, res) {
        usersModel.findOne({id: req.query.id})
            .populate('events')
            .exec(function (err, user) {
                if (err) {
                    res.json({ code: 1, error: err });
                } else {
                    res.json({
                        code: 1,
                        result: user
                    });
                }
            });
}
var getNumberOfUsers = function (req, res) {
        usersModel.count()
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
var addUser = function(req, res) {
          var users = new usersModel({
            name : req.body.name,
            password : req.body.password,
            username : req.body.username,
            access_token : uuidV4()
          });
          users.save(function (err) {
              if (err) res.json({code: 0, error: err});
              else {
                  res.json({code: 1, result: users});
              }
          });
      }
var editUser = function (req, res) {
  var usersId = req.query.eOId;
       usersModel.findOne({_id: usersId}, function (err, user) {
           if (err) res.json({code: 0, error: err});
           else if (!user) res.json({code: 2, error: 'khong tim thay chu su kien'});
           else {
             var password = req.query.password;
             var name = req.query.name;
             if(password) users.password = password;
             if(name) users.name = name;
               users.save(function (err) {
                   if (err) res.json({code: 0, error: err});
                   else{
                       res.json({code: 1, result: user});
                   }
               });
           }
       });
}

const getUserById = (id, callback) => {
  usersModel.findOne({'_id' : id}, (err, doc)=> {
    if(err) {
      res.send(err);
    } else{
      callback(null, doc);
    }
  }).populate('events');
};
const updateProfile = (req, res) =>{

}
module.exports = {
  addUser,
  editUser,
  getUsersOnPage,
  getNumberOfUsers,
  getUserById,
  getUsers,
  login,
  logout,
  updateProfile
}