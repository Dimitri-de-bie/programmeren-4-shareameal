const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

const bodyParser = require("body-parser");
const userrouter = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const mealrouter = require("./src/routes/meal.routes");

app.use(bodyParser.json());

let database = [];
let id = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen!`);
  next();
});

app.use(mealrouter);
app.use(userrouter);
app.use("/api", authRoutes);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

//error handler
// app.use((err, req, res, next) => {
//   console.log("Error: " + err.toString());
//   res.status(500).json({
//     satusCode: 500,
//     message: err.toString(),
//   });
// });

app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
