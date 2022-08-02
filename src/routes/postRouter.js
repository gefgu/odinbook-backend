const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const postRouter = express.Router();

postRouter.use(passport.authenticate("facebook-token", { session: false }));

postRouter.get("/", (req, res, next) => {
  const friends = req.user.friends;

  req.context.models.Post.find({ author: friends }).exec((err, postList) => {
    if (err) return next(err);

    res.json(postList);
  });
});

postRouter.post("/", [
  body("content", "Post Content must be specified").trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const post = new req.context.models.Post({
      content: req.body.content,
      author: req.user._id,
    });

    post.save(function (err) {
      if (err) return next(err);

      res.json({ message: "POST CREATED WITH SUCESS!", post });
    });
  },
]);

module.exports = postRouter;
