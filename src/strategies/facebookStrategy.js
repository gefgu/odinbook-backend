const FacebookTokenStrategy = require("passport-facebook-token");

const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env["FACEBOOK_APP_ID"],
    clientSecret: process.env["FACEBOOK_APP_SECRET"],
    fbGraphVersion: "v3.0",
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(`Access Token: ${accessToken}`);
    console.log(`Refresh Token: ${refreshToken}`);
    console.log(profile);
    return done(null, { name: "User" });
  }
);

module.exports = facebookStrategy;
