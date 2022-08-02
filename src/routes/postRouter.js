const express = require("express");
const passport = require("passport");

const postRouter = express.Router();

postRouter.use(passport.authenticate("facebook-token", { session: false }));

postRouter.get("/", (req, res, next) => {
  res.json("Posts");
});

module.exports = postRouter;
