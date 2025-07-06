const express = require("express");
const app = express();
require("dotenv").config();
require("./lib/firebase");
const numbersRoute = require("./routes/numbers");
const connectDB = require("./lib/connectDB");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/two-d", numbersRoute);

app.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});
