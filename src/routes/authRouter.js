const express = require("express");
const axios = require("axios").default;

const authRouter = express.Router();

authRouter.post("/facebook/token", async (req, res, next) => {
  const codeExchangeEndPoint = `https://graph.facebook.com/v14.0/oauth/access_token?client_id=${process.env["FACEBOOK_APP_ID"]}&redirect_uri=${process.env["AUTH_REDIRECT_URI"]}&client_secret=${process.env["FACEBOOK_APP_SECRET"]}&code=${req.body.code}`;

  const response = await axios.get(codeExchangeEndPoint);

  res.json({ access_token: response.data.access_token });
});

module.exports = authRouter;
