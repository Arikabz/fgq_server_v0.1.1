const mongoose = require("mongoose");

const CurrentWeekSchema = new mongoose.Schema({
  CurrentWeek: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("CurrentWeek", CurrentWeekSchema);
