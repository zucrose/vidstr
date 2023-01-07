const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const userRoutes = require("./routes/UserRoutes");
const movieRoutes = require("./routes/MovieRoutes");
const app = express();

app.use(cors());
app.use(express.json());
const url = process.env.MONGO_URL;
//console.log(url);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  });
app.use("/api/user", userRoutes);
app.use("/api/movie", movieRoutes);
app.listen(5000, console.log("started"));
