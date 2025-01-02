const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config();
// Load your OAuth 2.0 client ID and client secret from the environment or config
const CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;


const REDIRECT_URI = 'http://localhost:8080/user/oauth2callback';  // e.g., http://localhost:3000/oauth2callback

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Scopes define the level of access requested, e.g., viewing and managing YouTube content
const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly', // Read-only access to YouTube
  'https://www.googleapis.com/auth/userinfo.profile' // Access user's basic profile info
];
function auth(){ 
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'offline' gives you a refresh token
        scope: scopes
    });
    return url;
}

module.exports= {oauth2Client,auth};