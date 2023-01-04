const dotenv = require("dotenv");

dotenv.config();

const audience = process.env.AUTH0_AUDIENCE;
const domain = process.env.AUTH0_DOMAIN;
const serverPort = process.env.SERVER_PORT;
const clientOriginUrl = process.env.CLIENT_ORIGIN_URL;

const clientOrigins = ['htpps://localhost:6969']

module.exports = {
    audience,
    domain,
    serverPort,
    clientOriginUrl,
   clientOrigins,
};
