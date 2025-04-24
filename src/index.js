"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var cors_1 = require("cors");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
var MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default
  .connect(MONGO_URI)
  .then(function () {
    return console.log("MongoDB connected");
  })
  .catch(function (err) {
    return console.log("MongoDB connection error:", err);
  });
// Routes
app.get("/", function (req, res) {
  res.send("Hello from Express + TypeScript!");
});
// Start Server
app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
});
