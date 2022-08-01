const express = require("express");
const passport = require("passport");

const userRouter = express.Router();

userRouter.use(passport.authenticate("facebook-token", { session: false }));

userRouter.get("/", (req, res, next) => {
  req.context.models.User.find({}).exec((err, userList) => {
    if (err) return next(err);

    if (userList === null) {
      const err = new Error("User List not found");
      err.status = 404;
      return next(err);
    }

    res.json(userList);
  });
});

userRouter.get("/:userId", (req, res, next) => {
  req.context.models.User.findById(req.params.userId)
    .populate("friends")
    .populate("friendshipRequests")
    .exec((err, user) => {
      if (err) return next(err);

      if (user === null) {
        const err = new Error("User not found");
        err.status = 404;
        return next(err);
      }

      res.json(user);
    });
});

module.exports = userRouter;
