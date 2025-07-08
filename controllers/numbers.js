const Number = require("../models/numbers");
const getNumbers = async (req, res) => {
  try {
    const now = new Date();

    // Get current time as total minutes from midnight
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Calculate today (midnight) and 10 days ago
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 9);

    // Fetch all numbers from the last 10 days
    const numbers = await Number.find({
      date: { $gte: tenDaysAgo, $lte: today },
    }).sort({ date: 1, timeSlot: 1 });

    // Helper to convert "HH:mm" to total minutes
    function timeSlotToMinutes(timeSlot) {
      const [hourStr, minStr] = timeSlot.split(":");
      const h = parseInt(hourStr, 10);
      const m = parseInt(minStr, 10);
      return h * 60 + m;
    }

    // Filter numbers for today and past days
    const filtered = numbers.filter((number) => {
      const numberDate = new Date(number.date);
      numberDate.setHours(0, 0, 0, 0);

      if (numberDate.getTime() < today.getTime()) {
        // Include all numbers for previous days
        return true;
      } else {
        // Include today's numbers only if timeSlot <= current time
        return timeSlotToMinutes(number.timeSlot) <= currentMinutes;
      }
    });

    // Send the filtered list as a response
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching numbers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createNumber = async (req, res) => {
  try {
    const { timeSlot, number } = req.body;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if a number already exists for the given timeSlot today
    const alreadyExists = await Number.findOne({
      timeSlot: timeSlot,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Number already exists for today and this time slot.",
      });
    }

    // Create and save the new number
    const numberEntry = await Number.create({ timeSlot, number });
    res.status(201).json(numberEntry);
  } catch (error) {
    console.error("Error creating number:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { getNumbers, createNumber };
