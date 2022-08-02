const express = require("express");
const passport = require("passport");

const postRouter = express.Router();

postRouter.use(passport.authenticate("facebook-token", { session: false }));

postRouter.get("/", (req, res, next) => {
  const friends = req.user.friends;

  req.context.models.Post.find({ author: friends }).exec((err, postList) => {
    if (err) return next(err);

    res.json(postList);
  });
});

module.exports = postRouter;
