const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  groupID: {
    type: String,
    required: true,
  },
  weekNum: {
    type: Number,
    required: true,
  },
  predictionAssessment: {
    type: Object,
    require: true,
  },
  prediction: {
    type: Object,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Prediction", PredictionSchema);
