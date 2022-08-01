require("dotenv").config();
const express = require("express");
const passport = require("passport");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const facebookStrategy = require("./strategies/facebookStrategy");
const models = require("./models");

const app = express();

passport.use(facebookStrategy);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  req.context = { models };
  next();
});

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.get(
  "/",
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    res.json(req?.user);
  }
);

app.listen(3000, () => console.log("running"));
