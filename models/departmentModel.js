const mongoose = require("mongoose");
const { Schema } = mongoose;

const departmentDataSchema = new Schema({
  name: {
    type: String,
  },
});
const departmentData = mongoose.model("departments", departmentDataSchema);
module.exports = departmentData;
