const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminDataSchema = new Schema({
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
  imagefile: {
    type: String,
  },
});
const adminData = mongoose.model("adminData", adminDataSchema);
module.exports = adminData;
