const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect to database
mongoose.connect(config.database);

// On successful connection
mongoose.connection.on("connected", () =>{
    console.log("Connected to database "+config.database);
});

// On connection error
mongoose.connection.on("error", (err) =>{
    console.log("Database error "+err);
});

const app = express();

const users = require("./routes/users");

const port = 3000;

// CORS middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser middleware
app.use(bodyParser.json());

app.use("/users", users);

// Index route
app.get("/", (req, res) => {
    res.send("Hello there.");
});

app.listen (port, () =>{
    console.log("Server started on port "+port);
});