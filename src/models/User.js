const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  photoURL: { type: String, required: true },
  friends: { type: Array, required: false },
});

module.exports = mongoose.model("User", UserSchema);
