const User = require("../models/User");
const League = require("../models/League");

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.createLeague = async (req,res,next) => {
    try {
        const email = req.body.email;
        const leagueID = makeid(8);
        console.log('Generated ID: ' + leagueID)
        const leagueRes = await League.create(
            {
                leagueID: leagueID,
                users: [email]
            }, (err, doc) =>{
                if(err){
                    console.log(err)
                }
            }
        )
        console.log(leagueRes)
        const userResponse = await User.findOneAndUpdate(
            {email: email},
            {
                leagueID: leagueID,
            }
        )
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
