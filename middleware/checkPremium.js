function checkPremium(req, res, next) {
    if (req.user.premium === true) {
        next(); // User is premium, allow access
    } else {
        res.redirect("/user/premium");
    }
}
module.exports= checkPremium;