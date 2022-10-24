const mongoose = require("mongoose");

const WeekSchema = new mongoose.Schema({
  Week: {
    type: Number,
    required: true,
  },
  Games: {
    type: Array,
    require: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Week", WeekSchema);
