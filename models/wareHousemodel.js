const mongoose = require("mongoose");
const { Schema } = mongoose;

const loginSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role:{type:String,enum:["admin","staff","viewer"],}
});

const wareHouseLogin = mongoose.model("warehouselogin", loginSchema);
module.exports = wareHouseLogin;
