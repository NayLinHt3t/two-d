const mongoose = require("mongoose");
const NumberSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  timeSlot: {
    type: String,
    enum: ["10:00", "11:00", "12:00"],
    required: true,
  },
  date: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Number", NumberSchema);
