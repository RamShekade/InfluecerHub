const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyschema = new Schema({
    skills: [String],
    appliedJobs: [{ 
        job: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job'
        }
      }]
    ,
    portfolio:{type: String}, 
    image: {
        filename: {
            type: String,
            default: 'listingimage1.jpeg', // Default image file
        },
        url: {
            type: String,
            default: '/images/listingimage1.jpeg', // Default image URL if not provided
            // If the user provides an empty string or undefined, fall back to default
            set: (v) => v === "" || v == null ? '/images/listingimage1.jpeg' : v,
        }
    },

    location: {
        type: String,
      
    }
});

const companyProfile = mongoose.model("coompanyProfile", companyschema);
module.exports = companyProfile;