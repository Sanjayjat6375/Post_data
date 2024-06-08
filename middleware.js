const Listing = require("./modules/lesting.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "User not logged in, please log in first.");
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
};

module.exports.isRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }
    if (!res.locals.currentUser) {
        req.flash("error", "You must be logged in to do that");
        return res.redirect('/login');
    }
    if (!listing.owner?.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
