const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js")
const {validateReview, isLoggedIn} = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");
// const { createReview } = require("../controllers/reviews.js");



// REVIEWS
//POST ROUTE
router.post("/",isLoggedIn,/**isReviewAuthor,*/ validateReview,wrapAsync(reviewController.createReview));

// DELETE ROUTE
router.delete("/:reviewId",isLoggedIn,/**isReviewAuthor, */ wrapAsync(reviewController.destroyReview));


// router.delete("/review/:id/:id1", async(req, res)=>{
// router.delete("/:id1", async(req, res)=>{
//   const {id, id1} = req.params;

//    Review.findByIdAndDelete(id); 

//   res.redirect(`/listings/${id1}`)
// })

module.exports = router;

