const Movie = require("../models/MovieModel");
module.exports.addReview = async (req, res) => {
  try {
    const { movieId, newReview } = req.body;
    const movie = await Movie.findOne({ movieId });
    if (movie) {
      const { reviewArray } = movie;

      await Movie.findByIdAndUpdate(
        movie._id,
        {
          reviewArray: [...movie.reviewArray, newReview],
        },
        { new: true }
      );
    } else await Movie.create({ movieId, reviewArray: [newReview] });
    return res.json({ msg: "Success.Review Added" });
  } catch (err) {
    console.log(err);
    return res.json({ msg: "Error adding review" });
  }
};

module.exports.getReviewArray = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ movieId });
    // console.log(movieId);
    if (movie) {
      return res.json({ msg: "success", reviews: movie.reviewArray });
    } else return res.json({ msg: "Movie with given ID not found." });
  } catch (err) {
    return res.json({ msg: "Error while fetching review " });
  }
};

module.exports.removeReview = async (req, res) => {
  try {
    const { movieId, reviewIndex } = req.body;
    console.log(movieId, reviewIndex);
    const movie = await Movie.findOne({ movieId });
    if (movie) {
      const { reviewArray } = movie;

      console.log(reviewIndex);
      reviewArray.splice(reviewIndex, 1);

      await Movie.findByIdAndUpdate(
        movie._id,
        {
          reviewArray,
        },
        { new: true }
      );
      return res.json({ msg: "Review Deleted", reviews: reviewArray });
    } else return res.json({ msg: "movie not found" });
  } catch (err) {
    console.log(err);
    return res.json({ msg: "error deleting review" });
  }
};
