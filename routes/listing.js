const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing} = require("../middleware.js");


const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); 

  


const listingController = require("../controllers/listings.js");

//MAIN PAGE OF WEB SITE, INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

//NEW LISTING ADD
router.get("/new", isLoggedIn, listingController.renderNewForm);

//SHOW ROUTE

router.get("/:id", wrapAsync(listingController.showListing));

// Create New llisting
router.post("/new/add",isLoggedIn, upload.single("image"), wrapAsync(listingController.createListing)); 


//TO EDIT THE POST
router.get("/edit/:id", isLoggedIn, wrapAsync(listingController.renderEditForm));

// UPDATE route
router.put(
  "/:id/edit", isLoggedIn, upload.single("image"), wrapAsync(listingController.updateListing));

//to DELETE THE DATA FROM THE LISTINGS
router.delete("/delete/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;
