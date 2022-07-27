const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res, next) => res.json("Hello World!"));

app.listen(3000, () => console.log("running"));
