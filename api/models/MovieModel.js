const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  movieId: { type: Number, required: true, unique: true },
  reviewArray: Array,
});

module.exports = mongoose.model("movies", MovieSchema);
