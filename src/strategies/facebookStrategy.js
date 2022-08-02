const FacebookTokenStrategy = require("passport-facebook-token");
const { User } = require("../models");

const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env["FACEBOOK_APP_ID"],
    clientSecret: process.env["FACEBOOK_APP_SECRET"],
    fbGraphVersion: "v3.0",
  },
  function (accessToken, refreshToken, profile, done) {
    User.findOrCreate(
      {
        name: profile._json.name,
        photoURL: profile.photos[0].value,
        facebookId: profile.id.toString(),
      },
      (err, result) => {
        return done(err, result);
      }
    );
  }
);

module.exports = facebookStrategy;
