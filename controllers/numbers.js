const Number = require("../models/numbers");
const moment = require("moment-timezone");

const getNumbers = async (req, res) => {
  try {
    // Get current time in Asia/Yangon
    const nowYangon = moment().tz("Asia/Yangon");

    const currentMinutes = (nowYangon.hours() - 12) * 60 + nowYangon.minutes();
    // Today in Yangon (midnight)
    const todayYangon = nowYangon.clone().startOf("day");
    // End of today (23:59:59 in Yangon)
    const endOfTodayYangon = todayYangon.clone().endOf("day");
    // 10 days ago (inclusive of today)
    const tenDaysAgoYangon = todayYangon.clone().subtract(9, "days");

    // Convert to UTC for MongoDB query
    const numbers = await Number.find({
      date: {
        $gte: tenDaysAgoYangon.toDate(),
        $lte: endOfTodayYangon.toDate(),
      },
    }).sort({ date: 1, timeSlot: 1 });

    // Helper to convert timeSlot "HH:mm" to total minutes
    function timeSlotToMinutes(timeSlot) {
      const [hourStr, minStr] = timeSlot.split(":");
      const h = parseInt(hourStr, 10);
      const m = parseInt(minStr, 10);

      return h * 60 + m;
    }

    // Filter numbers for past days and today's passed slots
    const filtered = numbers.filter((number) => {
      const numberDate = moment(number.date).tz("Asia/Yangon").startOf("day");

      if (numberDate.isBefore(todayYangon)) {
        return true;
      } else {
        return timeSlotToMinutes(number.timeSlot) <= currentMinutes;
      }
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createNumber = async (req, res) => {
  try {
    const { timeSlot, number } = req.body;

    const nowYangon = moment().tz("Asia/Yangon");
    const startOfDay = nowYangon.clone().startOf("day");
    const endOfDay = nowYangon.clone().endOf("day");

    // Prevent duplicates for today and timeSlot
    const alreadyExists = await Number.findOne({
      timeSlot,
      date: {
        $gte: startOfDay.toDate(),
        $lte: endOfDay.toDate(),
      },
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Number already exists for today and this time slot.",
      });
    }

    // Save with default date set to today in your schema
    const numberEntry = await Number.create({
      timeSlot,
      number,
      date: endOfDay.toDate(),
    });
    res.status(201).json(numberEntry);
  } catch (error) {
    console.error("Error creating number:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getNumbersForAdmin = async (req, res) => {
  try {
    const nowYangon = moment().tz("Asia/Yangon");

    const todayYangon = nowYangon.clone().startOf("day");
    const endOfTodayYangon = todayYangon.clone().endOf("day");
    const tenDaysAgoYangon = todayYangon.clone().subtract(9, "days");

    // Fetch numbers from the last 10 days (including today), no timeSlot filtering
    const numbers = await Number.find({
      date: {
        $gte: tenDaysAgoYangon.toDate(),
        $lte: endOfTodayYangon.toDate(),
      },
    }).sort({ date: 1, timeSlot: 1 });

    res.json(numbers);
  } catch (error) {
    console.error("Error fetching numbers (admin):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getNumbers, createNumber, getNumbersForAdmin };
