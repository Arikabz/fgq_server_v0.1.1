const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  leagueID: {
    type: String,
    require: true,
  },
  users: {
    type: Array,
    require: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("League", LeagueSchema);
