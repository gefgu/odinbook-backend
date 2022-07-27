const express = require("express");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

app.listen(3000, () => console.log("running"));
