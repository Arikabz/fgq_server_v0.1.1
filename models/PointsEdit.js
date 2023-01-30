const mongoose = require("mongoose");

const PointsEditSchema = new mongoose.Schema({
    userID: String,
    pointsEdit: Number,
    reason: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("PointsEdit", PointsEditSchema);
