const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InfluencerSchema = new Schema({
    username: {type: String},
    skills: [String],
    bio: { type: String },
    socialMedia: {
        instagram: { type: String },
        youtube: { type: String },
        facebook: { type: String },
    },
    profilePic: { type: String },  // This will store the profile picture filename
    engagements: { type: Number, default: 0 },
    analytics: {
        growthRate: { type: Number, default: 0 },
        popularContent: { type: String },
    }
});

const Influencer = mongoose.model("Influencer", InfluencerSchema);
module.exports = Influencer;