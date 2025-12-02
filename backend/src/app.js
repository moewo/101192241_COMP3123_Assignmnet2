const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emp", employeeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "COMP3123 Assignment 1 API running" });
});

module.exports = app;