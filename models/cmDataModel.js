const mongoose = require("mongoose");
const { Schema } = mongoose;

const cmdataSchema = new Schema({
  companyName: {
    type: String,
    require: true,
  },
  clientID: {
    type: String,   
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  emailId: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  gstNO: {
    type: String,
    require: true,
  },
  address1: {
    type: String,
    require: true,
  },
  address2: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
  pincode: {
    type: String,
    require: true,
  },
  PAN: {
    type: String,
    require: true,
  },
  createdBy: {
    type: String,    
    require: true,
  },

  pocSections:[{
    Name:{
      type: String
    },
    email:{
      type: String
    },
    phone:{
      type: String
    },
    designation:{
      type: String
    },
    department:{
      type: String
    }
  }]
});

const cmData = mongoose.model("cmData", cmdataSchema);
module.exports = cmData;
