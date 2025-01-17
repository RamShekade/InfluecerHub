const express = require("express");
const router= express.Router();
const path = require('path');
const User = require("../models/influencer.js"); 
const Listing=require("../models/listing.js");


const multer = require('multer');

// ____________________________________________________________________________________
// store image in public image folder

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../public/images')); // Save in public/images folder
  },
  filename: (req, file, cb) => {
      // Set the file name
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name clashes
  }
});

const upload = multer({ storage: storage });
// __________________________________________________________________________________



router.get('/home', async (req, res) => {
   try {
      // Fetch user data (assuming logged-in user details are available)
      const Influencers = await User.find(); // req.user should have logged-in user details
      console.log(Influencers)
      if (!Influencers) {
        return res.status(404).send('User not found');
      }
  
      // Render the homepage EJS template
      res.render('company/home', {Influencers});
    } catch (error) {
      res.status(500).send(error);
    }
  });
router.get("/profile",(req,res)=>{
  res.render("company/profile");
})
router.post('/profile', upload.single('image'), async (req, res) => {
    console.log(req.body); // Check if form data is received
    try {
        // Create a listing object
        const listingData = {
            title: req.body.listing.title,
            description: req.body.listing.description,
            contact: req.body.listing.contact,
            eligibility: req.body.listing.eligibility,
            image: {
                filename: req.file.filename, // Save the uploaded filename
                url: `/images/${req.file.filename}` // Set the URL for the image
            }
        };

        const listing = new Listing(listingData);
        await listing.save();
        res.redirect(`/listing/${listing._id}`);
    } catch (e) {
        console.log(e);
        res.redirect('/listings/new'); // Redirect back to form if validation fails
    }
});

module.exports=router;