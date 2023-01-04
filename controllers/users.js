// just a copy of auth.js

const User = require("../models/User");

exports.checkUser = (req, res, next) => {

  const user = new User({
    email: req.body.email,
    userName: req.body.userName,
  });
    console.log('here')

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        console.log( "Account with that email address or username already exists.")
        return  "Account with that email address or username already exists."
      }
        User.create(user)
        console.log('user has been created')
    }
  );
}
