const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required: true,
    },
    
    description: String,
    
    image: {
        filename: {
            type: String,
            default: 'listingimage'
        },
        url: {
            type: String,
            default: 'https://www.istockphoto.com/photo/marketing-campaign-strategy-advertisement-brand-megaphone-gm1218733060-356225118?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fadvertising-agency&utm_medium=affiliate&utm_source=unsplash&utm_term=advertising+agency%3A%3Areduced-affiliates%3Acontrol',
            set: (v) => v === "" ? 'https://www.istockphoto.com/photo/marketing-campaign-strategy-advertisement-brand-megaphone-gm1218733060-356225118?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fadvertising-agency&utm_medium=affiliate&utm_source=unsplash&utm_term=advertising+agency%3A%3Areduced-affiliates%3Acontrol' : v,
        }
    },

    contact: Number,
    
    eligibility: Number,
    
    
    // owner: {
    //     type: Schema.Types.ObjectId,
    //     ref:"User"
    // }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

