// just a copy of auth.js

const User = require("../models/User");

exports.checkUser = async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            userName: req.body.userName,
        });
        if (!user.email || !user.userName){
            console.log('Undefined fields')
            return
        }

        const response = await User.findOne(
            {'email': user.email},
            (err, existingUser) => {
                if (err) {
                    console.log(err)
                            res.setHeader('Content-Type','application/json');
                            res.end(JSON.stringify({
                                firstTime: false,
                            }))
                    return (err);
                }
                else if (existingUser) {
                    console.log( "Account with that email address or username already exists.")
                            res.setHeader('Content-Type','application/json');
                            res.end(JSON.stringify({
                                firstTime: false,
                            }))
                    return  "Account with that email address or username already exists."
                } else{
                    User.create(user, function(err, doc){
                        if(err) {
                            console.log('Account with that email address or username already exists.')
                            res.setHeader('Content-Type','application/json');
                            res.end(JSON.stringify({
                                firstTime: false,
                            }))
                            return 'Account with that email address or username already exists.' 
                        } else if(!err){
                            console.log('user has been created')
                            console.log(doc)
                            res.setHeader('Content-Type','application/json');
                            res.end(JSON.stringify({
                                firstTime: true,
                            }))
                        }
                    })
                }
            }
        );

    } catch (error) {
        console.log(error)
    }
}
