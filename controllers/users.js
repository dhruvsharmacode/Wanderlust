const User = require("../models/user.js");

//Render Signup Form Route
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}


//Signup Route
module.exports.signup = async (req, res) => {
    try{ 
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        req.login(registeredUser, (err)=> {
            if(err) {
                return next(err);
            }
            req.flash("success", `Welcome ${registeredUser.username} to Wonderlust`)
            res.redirect("/listings")
        })

    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}


//Render Login Form Route
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}


//Login Route
module.exports.login = (req, res) => {
    req.flash("success", "Welcome to Wonderlust!")
    const redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}


//Logout Route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next (err);
        }
        req.flash("success", "logged you out!")
        res.redirect("/listings")
    }) 
}