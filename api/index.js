const express = require("express");
const app = express(); // create express app
var path = require('path');

// Routers
var usersRouter = require('./routes/users');
var addUser = require("./routes/addUser")
var removeUser = require("./routes/removeUser")
var matches = require("./routes/matches")
var addMatch = require("./routes/addMatch")
var removeMatch = require("./routes/removeMatch")
var recalcAllElos = require("./routes/recalcAllElos")

let public_dir = path.join(__dirname, '../build')

app.use(express.static(public_dir));
app.use("/users", express.static(public_dir))
app.use("/matches", express.static(public_dir))

app.use('/api/users', usersRouter);
app.use("/api/addUser", addUser);
app.use("/api/removeUser",removeUser);
app.use("/api/matches", matches);
app.use("/api/addMatch",addMatch);
app.use("/api/removeMatch", removeMatch);
app.use("/api/recalcAllElos", recalcAllElos);

// start express server on port 5000
app.listen(9000, () => {
  console.log("server started on port 9000");
});