// just a copy of auth.js
const User = require("../models/User");
const League = require("../models/League");

exports.registerUserInLeague = async (req,res,next) => {
    try {
        const email = req.body.email;
        const leagueID = req.body.leagueID;
        const leagueData = await League.findOne(
            {leagueID: leagueID}, (err, existingLeague) => {
                if(err) {
                    console.log(err)
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        league: 'invalid',
                        registered: false,
                    }))
                    return
                }
                else if (!existingLeague) {
                    console.log(err)
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        league: 'invalid',
                        registered: false,
                    }))
                    return
                }
            }
        )
        if(!leagueData){
            console.log('No such league.')
            return
        } else{
        const userDoc = await User.findOneAndUpdate(
            {email: email},{
                leagueID: leagueID,
                admin: false,
            }
        )
        const userArr = await leagueData.users
        userArr.push(userDoc)
        const leagueRes = await League.findOneAndUpdate(
            {leagueID: leagueID},
            {
                users: userArr,
            }
        )
        console.log('Registered in league succesfull.')
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({
            league: 'valid',
            registered: true,
            leagueID: leagueID,
        }))
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getLeagueUsers = async (req,res,next) => {
    try {
        const leagueID = req.body.leagueID
        const response = await User.find(
            {'leagueID': leagueID},
        ).sort({points:-1})
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                leagueMembers: response,
            }))
    } catch (error) {
        console.log(error)
    }
}

exports.getUserInfo = async (req,res,next) => {
    try {
        const email = req.body.email;
        const response = await User.findOne(
            {'email': email},
        )
        if(response.leagueID) {
            //console.log(leagueData)
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                registered: true,
                userData: response
                //leagueData: leagueData,
            }))
        } else{
            console.log('Not in league yet.')
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                registered: false,
                userData: response,
            }))
        }
        //console.log(response)
    } catch (error) {
        console.log(error)
    }
}

exports.checkUser = async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            userName: req.body.userName,
            points: 0,
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
                            //console.log(doc)
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
