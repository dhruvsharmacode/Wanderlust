const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middelware.js")
const listingController = require("../controllers/listings.js")

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router
.route("/")
.get(wrapAsync(listingController.index)) //Index Route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing)) //Create Post Route



//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm)



router
.route("/:id")
.get(listingController.showListing) //Show route
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing)) //Update Route
.delete(isLoggedIn, isOwner, listingController.deleteListing) //Delete Route



//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.renderEditForm)


module.exports = router;