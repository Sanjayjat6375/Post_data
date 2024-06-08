const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../../middleware.js");
const listingControls = require("../../conttrols/listingControls.js");
const multer = require("multer");
const { storage } = require("../../cloudConfig.js");
const upload = multer({ storage });

// Index route
router.get("/listings", listingControls.index);

// Create listings/new route
router.get("/listings/new", isLoggedIn, listingControls.creatForm);

// Create listing
router.post("/listings", isLoggedIn, upload.single('listing[image]'), listingControls.createListing);

// Edit route
router.get("/listings/:id/edit", isLoggedIn, isOwner, listingControls.editListing);

// Update route
router.put("/listings/:id", upload.single('listing[image]'), isLoggedIn, isOwner, listingControls.upldateListing);

// Show route
router.get("/listings/:id", isLoggedIn, listingControls.ownerListing);

// Delete route
router.delete("/listings/:id", isLoggedIn, isOwner, listingControls.deleteListing);

router.get('/search', isLoggedIn, listingControls.searchFun);

// 404 route
router.use('*', (req, res) => {
    res.status(404).render("listing/pagenotfound");
});

module.exports = router;
