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

const getInitials = (result) => {
    if(result.includes(' ')){
        let splitSpaces = result.split(' ').map(x=> {
            if(!x.includes('.')){
                return x.charAt()
            }else {return x}
        }).join('')
        if(splitSpaces.includes('.')){
            return splitSpaces.split('').filter(x=> x!=='.').join('')
        } else{
            return splitSpaces
        }

    } else{
        return result.toUpperCase().slice(0,3)
    }
}
exports.updatePoints = async (req,res,next) => {
    try {
        const leagueID = req.body.leagueID;
        const leagueDoc = await League.findOne(
            {leagueID: leagueID},
        )
        const allWeeks = await Week.find({}).lean()
        const userArr = leagueDoc.users;
        const userArrUpdated = await Promise.all(userArr.map(x=>{
            return User.findOne({_id: x._id})
        }))
        let updatedUserArr = []
        const predictions = await Promise.all(userArr.map(x=>{
            return Prediction.find({user:x._id}).lean()
        }))
        predictions.forEach((x,i)=>{
            const user = userArrUpdated[i];
            let points = 0;
            x.forEach((y,i2)=>{
                const results = allWeeks.find(e=> e.Week === y.weekNum).Games.map(a=> a.result || a.Venue)
                //console.log(results)
                y.predictions.forEach((z,i3)=>{
                    if(z.awayPrediction&&z.homePrediction){
                        const result = (results[i3].replace(/([A-Z]|\s|[\/])/g,'').split('-').map(b=>Number(b)))
                        console.log(result)
                        if(Number(result[0])){
                            const resultArr = results[i3].split(' ')
                            const awayInitials = getInitials(z.Away)
                            let awayResult;
                            let homeResult;

                            if(awayInitials === resultArr[0]){
                                awayResult = result[0]
                                homeResult = result[1]
                                console.log('away: '+awayResult+', home: '+homeResult)
                            }else {
                                awayResult = result[1]
                                homeResult = result[0]
                                console.log('away: '+awayResult+', home: '+homeResult)
                            }
                            console.log(user.userName)
                            console.log(results[i3])
                            console.log('prediction:')
                            console.log(z.Away+' : '+z.awayPrediction+' - '+z.Home+' : '+ z.homePrediction)
                            const guessedScore = z.awayPrediction == awayResult && z.homePrediction == homeResult;
                            const guessedRight = (z.awayPrediction < z.homePrediction) == (awayResult < homeResult)
                            if(guessedScore){
                                points += 5
                                console.log('+5 points')
                            } else if( guessedRight ){
                                points += 1
                                console.log('+1 point')
                            }
                            console.log('got score: '+ guessedScore)
                            console.log('guessed right: '+ guessedRight)
                            console.log('-')
                        }
                    }
                })
            })
            const extra = user.extraPoints || 0;
            user.seasonPoints = points;
            user.points = points + extra;
            console.log('seasonPoints: '+ user.seasonPoints)
            console.log('userpoints: '+ user.points)
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
                    seasonPoints: u.seasonPoints,
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
