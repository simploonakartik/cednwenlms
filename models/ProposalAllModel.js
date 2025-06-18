const mongoose = require("mongoose");
const { Schema } = mongoose;

const proposalAllSchema = new Schema({
  Amount: {
    type: String,
  },
  ClientName: {
    type: String,
  },
  Note: {
    type: String,
  },
  PaymentTerms: {
    type: String,
  },
  ProposalID: {
    type: String,
  },
  ProposalName: {
    type: String,
  },  
  Quantity: {
    type: String,
  },
  Rate: {
    type: String,
  },
  SelectProducts: {
    type: String,
  },
  Tax: {
    type: String,
  },
  Terms: {
    type: String,
  },
  ValidityDate: {
    type: String,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
  },
  companyName: {
    type: String,
  },
  description: {
    type: String,
  },
  emailId: {
    type: String,
  },
  fullName: {
    type: String,
  },
  gstNO: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  pincode: {
    type: String,
  },
  productName: {
    type: String,
  },
  sellingPrice: {
    type: String,
  },
  skuId: {
    type: String,
  },
  state: {
    type: String,
  },
});

const ProposalAll = mongoose.model("proposalAll", proposalAllSchema);
module.exports = ProposalAll;
