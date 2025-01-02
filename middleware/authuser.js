const user=require("../models/user");
async function ensureAuthUser(req, res, next) {
    const influencer= await user.findOne({username: req.user.username});
    if (influencer) {  // you're using Passport.js
      res.locals.username = req.user.username;
      return next();  // User is authenticated, proceed to the next middleware/route
    } else {
      // User is not authenticated
      res.redirect('/login');  // Redirect them to the login page
    }
  }
  
  module.exports = ensureAuthUser;
  