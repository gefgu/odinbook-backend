const express = require("express");

const authRouter = express.Router();

authRouter.get("/", (req, res, next) => res.json("Auth"));

module.exports = authRouter;
