const User = require("../modules/user");

// signup 
module.exports.signup = (req, res) => {
    res.render("listing/signup.ejs");
}

// create router
module.exports.createForm = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (error) => {
            if (error) {
                return next(error);
            }
            req.flash("success", "user registered successfully");
            res.redirect("/listings");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect('/signup');
        console.log("user already exists")
    }
}

// login
module.exports.login = (req, res) => {
    res.render("listing/login.ejs");
}

// logout 
module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "you are logged out");
        res.redirect('/listings');
    });
}

// create login form
module.exports.createLoginForm = (req, res) => {
    req.flash("success", "welcome back to the home page");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}
