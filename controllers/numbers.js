const Number = require("../models/numbers");
const getNumbers = async (req, res) => {
  const numbers = await Number.find();
  res.json(numbers);
};

const createNumber = async (req, res) => {
  const alreadyExists = await Number.findOne({
    timeSlot: req.body.timeSlot,
  });

  if (alreadyExists) {
    return res.status(400).json({ message: "Number already exists" });
  }
  const number = await Number.create(req.body);
  if (!number) {
    return res.status(400).json({ message: "Something went wrong" });
  }
  res.json(number);
};

const updateNumber = async (req, res) => {
  const number = await Number.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );
  if (!number) {
    return res.status(400).json({ message: "Something went wrong" });
  }
  res.json(number);
};

module.exports = { getNumbers, createNumber, updateNumber };
