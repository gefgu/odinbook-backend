const express = require("express");
const passport = require("passport");
const { removeObjectDuplicatesOfArray } = require("../helpers");

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

userRouter.post("/:userId/friends", async (req, res, next) => {
  const userFromBody = await req.context.models.User.findById(
    req.body.userId
  ).exec();

  if (userFromBody === null) {
    const err = new Error("User from body request not found");
    err.status = 404;
    return next(err);
  }

  const userFromParams = await req.context.models.User.findById(
    req.params.userId
  ).exec();

  if (userFromParams === null) {
    const err = new Error("User from URL params found");
    err.status = 404;
    return next(err);
  }

  userFromBody.friends = removeObjectDuplicatesOfArray(
    userFromBody.friends.concat(userFromParams)
  );
  userFromParams.friends = removeObjectDuplicatesOfArray(
    userFromParams.friends.concat(userFromBody)
  );

  await userFromBody.save();
  await userFromParams.save();

  res.status(200).json({ msg: "Successful", userFromBody, userFromParams });
});

userRouter.delete("/:userId/friends", async (req, res, next) => {
  const userFromBody = await req.context.models.User.findById(
    req.body.userId
  ).exec();

  if (userFromBody === null) {
    const err = new Error("User from body request not found");
    err.status = 404;
    return next(err);
  }

  const userFromParams = await req.context.models.User.findById(
    req.params.userId
  ).exec();

  if (userFromParams === null) {
    const err = new Error("User from URL params found");
    err.status = 404;
    return next(err);
  }

  userFromBody.friends = userFromBody.friends.filter(
    (friend) => friend._id.toString() !== userFromParams._id.toString()
  );

  userFromParams.friends = userFromParams.friends.filter(
    (friend) => friend._id.toString() !== userFromBody._id.toString()
  );

  await userFromBody.save();
  await userFromParams.save();

  res.status(200).json({ msg: "Successful", userFromBody, userFromParams });
});

module.exports = userRouter;
