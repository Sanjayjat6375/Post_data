const Listing = require("../modules/lesting.js")

// index router
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listing/index", { allListings });
}

// new router
module.exports.creatForm = (req, res) => {
    res.render("listing/create");
}

// create listing router
module.exports.createListing = async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;

        console.log(url, "5122", filename)
        const newListing = new Listing({
            title: req.body.title,
            description: req.body.description,
            image: { url, filename },
            price: req.body.price,
            location: req.body.location,
            country: req.body.country,
            owner: req.user._id
        });
        await newListing.save();
        req.flash("success", "New listing created successfully");
        res.redirect('/listings');
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// search functionality
module.exports.searchFun = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const searchResults = await Listing.find({
            $or: [
                { country: new RegExp(searchTerm, 'i') },
            ]
        });
        res.render('listing/searchResults', { listings: searchResults, searchTerm });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching for listings.');
    }
}

// edit router
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listing/edit", { listing });
}

// update router
module.exports.upldateListing = async (req, res) => {
    let { id } = req.params;
    let listingImage = await Listing.findByIdAndUpdate(id, { ...req.body });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listingImage.image = { url, filename }
        await listingImage.save();
    }

    req.flash("success", "Post updated successfully");
    res.redirect("/listings");
}

// delete router
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Post deleted successfully");
    res.redirect("/listings");
}

// owner router
module.exports.ownerListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate('owner');
    if (!list) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render("listing/show", { list, currentUserId: req.user._id });
}
