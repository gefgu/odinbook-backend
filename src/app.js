require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const facebookStrategy = require("./strategies/facebookStrategy");
const models = require("./models");

const app = express();

const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ercua.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
app.use("/posts", postRouter);

app.get(
  "/",
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    res.json(req?.user);
  }
);

app.use((err, req, res, next) => {
  res.json({ error: err });
});

app.listen(3000, () => console.log("running"));
