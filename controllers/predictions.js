const User = require("../models/User");
const League = require("../models/League");
const Week = require("../models/Week");
const Prediction = require("../models/Prediciton");
const Prediciton = require("../models/Prediciton");

exports.makePredictionTemplate = async (req,res,next) => {
    try {
        const userID = req.body.userID;
        const weeknum = req.body.weeknum
        const leagueID = req.body.leagueID;
        const weekDoc = await Week.findOne(
            {'Week': weeknum}
        )
        const gamesArray = weekDoc.Games;
        const predictions = gamesArray.map((e,i)=>{
            return {
                'gameNum': i+1,
                'Away': e.Away.replace(/[\s\n\d]/g,'').split(/(?=[A-Z])/).join(' '),
                'awayPrediction': '',
                'Home': e.Home.replace(/[\s\n\d]/g,'').split(/(?=[A-Z])/).join(' '),
                'homePrediction': '',
                'result': e.result,
            }
        })
        const predictionDoc = await Prediction.findOne(
            {
                weekNum: weeknum,
                leagueID: leagueID,
                user: userID,
            }, (err, doc) =>{
                if(err){
                    console.log(err)
                }
                if(doc){
                    console.log('Existing prediction document found.')
                    //console.log(doc)
                    res.setHeader('Content-Type','application/json');
                    res.end(JSON.stringify({
                        predictionTemplate: doc,
                    }))
                }
            }
        )
        if(!predictionDoc){
            const newPredictionDoc = await Prediction.create(
                {
                    user: userID,
                    leagueID: leagueID,
                    weekNum: weeknum,
                    predictions: predictions,
                }, (err, doc) => {
                    if(err){
                        console.log(err)
                    }
                    if(doc){
                        console.log('Prediction template created succesfully.')
                        console.log(doc)
                        res.setHeader('Content-Type','application/json');
                        res.end(JSON.stringify({
                            predictions: newPredictionDoc,
                        }))
                    }
                }
            )
        }
        //console.log(predictionDoc)
    } catch (error) {
        console.log(error)
    }
}
