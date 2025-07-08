const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true, // Ensure unique numbers
    },
    timeSlot: {
      type: String,
      enum: ["5:30", "6:30", "7:30", "8:30", "9:30", "10:30"], // Strict validation
      required: true,
    },
    date: {
      type: Date,
      default: () => {
        // Default to midnight of the current day
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Number", NumberSchema);
