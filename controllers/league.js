const User = require("../models/User");
const League = require("../models/League");
const Prediction = require("../models/Prediciton");
const Week = require("../models/Week");

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.updatePoints = async (req,res,next) => {
    try {
        const leagueID = req.body.leagueID;
        const leagueDoc = await League.findOne(
            {leagueID: leagueID},
        )
        const allWeeks = await Week.find({}).lean()
        const userArr = leagueDoc.users;
        let updatedUserArr = []
        const predictions = await Promise.all(userArr.map(x=>{
            return Prediction.find({user:x._id}).lean()
        }))
        predictions.forEach((x,i)=>{
            const user = userArr[i];
            let points = 0;
            x.forEach((y,i2)=>{
                const results = allWeeks.find(e=> e.Week === y.weekNum).Games.map(a=> a.result || a.Venue)
                //console.log(results)
                y.predictions.forEach((z,i3)=>{
                    if(z.awayPrediction&&z.homePrediction){
                        const result = (results[i3].replace(/([A-Z]|\s)/g,'').split('-').map(b=>Number(b)))
                        if(Number(result[0])){
                            console.log(z.Away+' : '+z.awayPrediction+' - '+z.Home+' : '+ z.homePrediction)
                            const awayResult = result[0]
                            const homeResult = result[1]
                            const guessedScore = z.awayPrediction == awayResult && z.homePrediction == homeResult;
                            const guessedRight = (z.awayPrediction < z.homePrediction) === (awayResult < homeResult)
                            if(guessedScore){
                                points += 5
                            } else if( guessedRight ){
                                points += 1
                            }
                            console.log('got score: '+ guessedScore)
                            console.log('guessed right: '+ guessedRight)
                            console.log('-')
                        }
                    }
                })
            })
            user.points = points
            updatedUserArr.push(user)
            console.log('user: '+ user.userName)
            console.log('points: '+ user.points)
        })
        const updatedLeague = await League.findOneAndUpdate(
            {leagueID: leagueID},
            {
                users: updatedUserArr,
            }
        )
        const updatedUsers = await Promise.all(updatedUserArr.map(u=>{
            return User.findOneAndUpdate({_id: u._id},
                {
                    points: u.points,
                })
        }))
        if(updatedLeague&&updatedUsers){
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                updated: true,
            }))
        } else{
            res.setHeader('Content-Type','application/json');
            res.end(JSON.stringify({
                updated: false,
            }))
        }
    } catch (error) {
        console.log(error)
    }
}

exports.createLeague = async (req,res,next) => {
    try {
        const email = req.body.email;
        const leagueID = makeid(8);
        console.log('Generated ID: ' + leagueID)
        const userResponse = await User.findOneAndUpdate(
            {email: email},
            {
                leagueID: leagueID,
                admin: true,
            }
        )
        console.log(userResponse)
        const leagueRes = await League.create(
            {
                leagueID: leagueID,
                users: [userResponse],
                admin: userResponse._id
            }, (err, doc) =>{
                if(err){
                    console.log(err)
                }
            }
        )
        console.log(leagueRes)
        console.log('New league created succesfully.')
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({
            league: 'valid',
            registered: true,
            leagueID: leagueID,
        }))
    } catch (error) {
        console.log(error)
    }
}
