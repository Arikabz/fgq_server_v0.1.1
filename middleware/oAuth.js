var axios = require('axios')

const tokenEndpoint = 'https://dev-7fzxcbarf08zoaab.us.auth0.com/oauth/token'

const oAuth = (req,res,next) =>{
    let code = req.query.code;

    if(!code){
        res.status(401).send('Missing authorization code')
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code')
    params.append('client_id', 'e1Lr5fXH5T4VrRoCEvg1CBHwRdSj0Qcs')
    params.append('client_secret', 'tWkQclTAgRRMq-7t0lF16gDb45fzG_5e8JHVw0lEwINRRFpB9qVmesK67QtZOx1n')
    params.append('code', code)
    params.append('redirect_uri', 'http://localhost:3000/dashboard')

    axios.post(tokenEndpoint, params)
    .then( response=> {
            req.oauth = response.data
            next();
        })
    .catch(err=> {
            console.log(err);
            res.status(403).json(`Reason: ${err.message}`)
        })
}

module.export = oAuth
