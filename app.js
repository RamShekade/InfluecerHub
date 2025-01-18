const express = require("express");
const { google } = require('googleapis');
const app = express();
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');

const Listing = require("./models/listing.js");
const FListing = require("./models/Flisting.js");
const methodOverride = require("method-override");
const path = require("path");
const multer = require('multer');
const ejsMate = require("ejs-mate");
const Flisting = require('./models/Flisting');  // Import the Flisting model

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 
const Freelancer=require('./models/Flisting');
const companyschema=require('./models/listing.js');
const Message = require('./models/message');  

const wrapAsync = require("./utils/wrapAsync");
const ensureAuthenticated = require('./middleware/isauth.js');
const ensureAuthUser = require('./middleware/authuser.js');
const checkPremium = require('./middleware/checkPremium.js');

const user=require("./routes/user");
const company=require("./routes/company.js");
const freelancer=require("./routes/freelancer.js")

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);


const cors = require("cors")
// for connecting with react 
// Enable CORS for all routes
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from your React app
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
//   credentials: true, // Allow credentials like cookies if needed
// }));


// ___________________________________________________________
const MONGO_URL = 'mongodb+srv://ramshekade08:B9Wj8W0lj8uk4l7f@cluster0.jutup.mongodb.net/InfluencerHub?retryWrites=true&w=majority';

async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,   // Use the new MongoDB connection string parser
      useUnifiedTopology: true, // Ensure the driver handles connections efficiently
    });
    console.log("Connected to Atlas DB");
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
}

main();

// ____________________________________________________________________________________


// __________________________________________________________

const session = require('express-session'); 
const flash = require('connect-flash');




const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'fallbackSecret', // Use environment variable for the secret
    resave: false, // Avoid resaving unmodified sessions
    saveUninitialized: false, // Don't save empty sessions
    store: MongoStore.create({
      mongoUrl: MONGO_URL, // MongoDB URI
      collectionName: 'sessions', // Optional: Specify collection name for sessions
      ttl: 14 * 24 * 60 * 60, // Sessions expire in 14 days
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      secure: process.env.NODE_ENV === 'production', // Only send cookies over HTTPS in production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: 'strict', // Protect against CSRF
    },
  };
  
  

  app.use(session(sessionOptions));


app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});  

app.use(express.json());

//for passport authentication
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// store image in public image folder

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Save in public/images folder
    },
    filename: (req, file, cb) => {
        // Set the file name
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name clashes
    }
});

const upload = multer({ storage: storage });

// __________________________________________________________________________________


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



// ____________________________________________________________________________________________

app.use("/user",ensureAuthenticated,ensureAuthUser, user);
app.use("/company",ensureAuthenticated,company);
app.use("/freelancer",ensureAuthenticated,freelancer);
// _______________________________________________
// /home page
 app.get("/", (req, res) => {
    res.render("Hlistings/home.ejs");
});


// _______________________________________________
//  influencer page


// ______________________________________________________________________________________
// signup page

// Route to render signup page
app.get("/signup", (req, res) => {
    res.render("user/signup.ejs",{username:"user"});
});

// Route to handle signup form submission
app.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;  // Destructure form data
        const newUser = new User({ username, email, role });   // Create new user with role
       
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);  // Log registered user info
        
        req.login(registeredUser, (err) => {  // Automatically log in the user
            if (err) {
                return next(err);  // Pass error to next middleware if login fails
            }
            req.flash('success_msg', 'Your form was successfully submitted!');  // Success message
            return res.redirect("/login");  // Redirect to listings page after successful registration and login
        });
    } catch (e) {
        console.log(e)
        req.flash("error_msg", e.message);  // Handle any errors (e.g., user already exists)
        return res.redirect("/signup");  // Redirect back to signup page if error occurs
    }
}));



// _______________________________________________________________________________________________

// login page

app.use("/",(req, res, next) => {
    res.locals.username = req.user ? req.user.username : null;  // Makes 'username' available in all views
    next();
  });


app.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

app.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), async(req, res) => {
    const reqrole=req.body.role; 
    console.log(reqrole);// Extract role from authenticated user
    // Extract role from authenticated user
    const {role}=await User.findOne({username: req.user.username})
 
    req.flash("success_msg", `Welcome back, ${req.user.username}!`);
//    if(reqrole==role){
    // Redirect based on the role
        if (reqrole === "user") {
                res.redirect("/user/home");
            
             
        } else if (reqrole === "company") {
            
                res.redirect("/company/profile");
        
             
        } else if (reqrole === "freelancer") {
            
                res.redirect("/freelancer/profile");
           
             
        } else {
            res.redirect("/"); // Fallback
        }}
// }
);

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {  // The callback is needed for newer versions of Passport.js
    if (err) { 
      return next(err); 
    }
    res.redirect('/login');  // Redirect to the login page or home after logout
  });
});










// ____________________________________________________________
//index route
// route for listing
app.get("/listings",checkPremium, async (req,res) =>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
    });


// route for Flisting
app.get("/freelancers", checkPremium,async (req, res) => {
    const allFreelancers = await FListing.find({});
    res.render('Flistings/index.ejs', { allFreelancers });
    });
    



// ____________________________________________________________

//new company route
app.get("/listings/new",(req,res)=>{
    res.render('listings/new.ejs');
 });

 
 //new freelancer route
 app.get("/freelancers/new",(req,res)=>{
    res.render('Flistings/new.ejs');
 });



// ____________________________________________________________
// create company route
app.post('/listings', upload.single('listing[image]'), async (req, res) => {
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




// create freelancer route
app.post('/freelancers', async (req, res) => {
    console.log(req.body);  // Check if form data is received
    try {
        const flisting = new Flisting(req.body.flisting);  // Use the correct path for the freelancer form data
        await flisting.save();  // Save the new freelancer listing to the database
        res.redirect(`/freelancers/${flisting._id}`);  // Redirect to the specific freelancer page after saving
    } catch (e) {
        console.log(e);  // Log any errors for debugging
        res.redirect('/freelancers/new');  // Redirect back to the form if something goes wrong
    }
});


app.get("/freelancers", ensureAuthenticated,async (req, res) => {
    const allFreelancers = await FListing.find({});
    res.render('Flistings/index.ejs', { allFreelancers });
    });
    

// ____________________________________________________________
// edit route
app.get("/listings/:id/edit", async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// ____________________________________________________________
// update route
app.put("/listings/:id",async(req,res) =>{
    let {id} =req.params; 
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    res.redirect(`/listing/${id}`);
});
//________________________________________________________________________________________
//Delete route
app.delete("/listings/:id", async(req,res) =>{
    let {id} = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

 // ____________________________________________________________
//show compnay route
// route 2

app.get("/listing/:id", async(req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//show freelancer route
app.get("/freelancer/:id", async (req, res) => {
    let { id } = req.params;
    const freelancer = await Flisting.findById(id);  // Use Flisting model
    res.render("Flistings/show.ejs", { freelancer });  // Render show.ejs for freelancer
});
// for socket io message connection
io.on('connection', (socket) => {
    console.log('New user connected');

    // Listen for incoming messages
    socket.on('chatMessage', async (data) => {
        const newMessage = new Message({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
        });

        await newMessage.save(); // Save the message to the database

        // Emit the message back to both sender and receiver
        io.emit('message', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// analytics

app.get("/analytics/instagram", (req, res) => {
    res.render("user/instagram"); // Simple response with "Coming Soon"
});

app.get("/analytics/facebook", (req, res) => {
    res.render("user/instagram"); // Simple response with "Coming Soon"
});

app.get("/performance", (req, res) => {
    res.render("user/instagram"); // Simple response with "Coming Soon"
});

//
app.get("/chat/:user",(req,res)=>{
    res.render("user/chat",{username:req.user.username,Receiver: req.params.user});
})
// Start the server
server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
