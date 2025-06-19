const mongoose = require("mongoose");
const { Schema } = mongoose;

const userdataSchema = new Schema({
  userName: {
    type: String,
  },
  employeeId: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  jobrole: {
    type: String,
  },
  mobileNo: {
    type: String,
  },
  location: {
    type: String,
  },
});

const USER = mongoose.model("useraccess", userdataSchema);
module.exports = USER;