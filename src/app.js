require("dotenv").config();
const express = require("express");
const passport = require("passport");
const authRouter = require("./routes/authRouter");
const facebookStrategy = require("./strategies/facebookStrategy");

const app = express();

passport.use(facebookStrategy);

app.use(passport.initialize());

app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.get("/", passport.authenticate("facebook-token"), (req, res, next) => {
  console.log("Hello World!");
  console.log(`User: ${req?.user}`);
  res.json("Hi");
});

app.listen(3000, () => console.log("running"));
