const express = require("express");
const router= express.Router();
const path = require('path');
const Freelancer=require('../models/Flisting');

const multer = require('multer');
const { use } = require("passport");





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




router.get("/profile",async(req,res)=>{
    try {
        let flisting = await Freelancer.findOne({username: req.user.username});
        if(flisting){
        res.render('Flistings/profile', { flisting }); 
        // Render EJS template with profile data
        }else{
            flisting=null;
            res.render('Flistings/profile',{flisting})
        }  
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
});


router.post('/profile', upload.single('image'), async (req, res) => {
    try {
      const { role, location, skills, portfolio } = req.body;
      const username = req.user.username;
      const email = req.user.email || null;
      // Find if the freelancer profile already exists for the user
      let flisting = await Freelancer.findOne({ username: username });
  
      if (flisting) {
        // If the profile exists, update it
        flisting.role = role;
        flisting.location = location;
        flisting.skills = skills.split(',').map(skill => skill.trim());
        flisting.portfolio = portfolio;
  
        // If a new image is uploaded, update the image
        if (req.file) {
          flisting.image = {
            filename: req.file.filename,
            url: `/images/${req.file.filename}`
          };
        }
  
        await flisting.save();
      } else {
        // If no profile exists, create a new one
        flisting = new Freelancer({
          username: username,
          role,
          email,
          location,
          skills: skills.split(',').map(skill => skill.trim()),
          portfolio,
          image: {
            filename: req.file ? req.file.filename : 'listingimage1.jpeg',
            url: req.file ? `/images/${req.file.filename}` : '/images/listingimage1.jpeg'
          }
        });
  
        await flisting.save();
      }
  
      // Redirect to the profile view
      res.redirect(`/freelancer/profile`);
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  router.get("/freelancers", async (req, res) => {
    const allFreelancers = await FListing.find({});
    res.render('Flistings/index.ejs', { allFreelancers });
    });
    

module.exports= router;