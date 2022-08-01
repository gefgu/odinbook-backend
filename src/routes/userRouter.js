const express = require("express");

const userRouter = express.Router();

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

module.exports = userRouter;
