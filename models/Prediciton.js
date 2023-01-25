const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  leagueID: {
    type: String,
    required: true,
  },
  weekNum: {
    type: Number,
    required: true,
  },
  predictions: {
    type: Object,
    require: true,
  },
  user: {
    type: String,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Prediction", PredictionSchema);
