const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'company', 'freelancer'],  // Define the allowed roles
        required: true  // Ensure the role is provided during registration
    },
    premium:{
        type: Boolean,
        default: false
    }
});

// Apply the passportLocalMongoose plugin to userSchema
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User', userSchema);
module.exports = User;
