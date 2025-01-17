// const mongoose = require("mongoose");
// const initdata = require("./Cdata.js"); // Correct import
// const Listing = require("../models/listing.js");

// const MONGO_URL = 'mongodb://localhost:27017/influencerhub';

// main()
//   .then(() => {
//     console.log("connected to DB");
//     return initDB(); // Ensure initDB is called after connection
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({}); 
//   await Listing.insertMany(initdata.data);
//   console.log("data was initialize");
//   }

//   initDB();

const mongoose = require("mongoose");
const initdata = require("./Fdata.js"); // Correct import for Fdata
const FListing = require("../models/Flisting.js"); // Import the new FListing model

const MONGO_URL = 'mongodb://localhost:27017/influencerhub';

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB(); // Ensure initDB is called after connection
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await FListing.deleteMany({}); // Delete existing FListing documents
  await FListing.insertMany(initdata.data); // Insert new data from Fdata.js
  console.log("Data was initialized");
}

initDB();
