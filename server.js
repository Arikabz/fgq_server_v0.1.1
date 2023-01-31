const express = require("express");
const app = express();
const {auth } = require('express-oauth2-jwt-bearer')
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const apiRoutes = require("./routes/webscrapper");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");
const leagueRoutes = require("./routes/league");
const predictionsRoutes = require("./routes/predictions");


//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Use cors

app.use(helmet());
var corsOptions ={
    origin: 'https://fgq.up.railway.app/',
    operationSuccessStatus: 200,
}
app.use(cors());

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//jwtCheck

const checkJwt = auth({
    audience: 'https://fgq.server',
    issuerBaseURL: 'https://dev-7fzxcbarf08zoaab.us.auth0.com'
})


//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//Authorization Middleware Oauth; Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/user", checkJwt, userRoutes);
app.use("/api", checkJwt, apiRoutes);
app.use("/league", checkJwt, leagueRoutes);
app.use("/predictions", checkJwt, predictionsRoutes);


//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it! Port: -- "+process.env.PORT);
});
