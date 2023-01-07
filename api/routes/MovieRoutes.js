const {
  addReview,
  getReviewArray,
  removeReview,
} = require("../controllers/MovieController");

const router = require("express").Router();

router.post("/addReview", addReview);
router.get("/fetchReview/:movieId", getReviewArray);
router.put("/removeReview", removeReview);
module.exports = router;
