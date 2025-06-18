const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userLogin = mongoose.model("userLogin", loginSchema);
module.exports = userLogin;
