const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminDataSchema = new Schema({
  rows: [
    {
      Amount: { type: Number },
      Tax: { type: Number },
      CGST: { type: Number },
      SGST: { type: Number },
      Quantity: { type: Number },
      Rate: { type: Number },
      SelectProducts: {
        type: String,
      },
    },
  ],
  BillCompanyName: {
    type: String,
  },
  BillAddress: {
    type: String,
  },
  BillCity: {
    type: String,
  },
  BillState: {
    type: String,
  },
  BillPincode: {
    type: String,
  },
  ShipCompanyName: {
    type: String,
  },
  ShipAddress: {
    type: String,
  },
  ShipCity: {
    type: String,
  },
  ShipState: {
    type: String,
  },
  ShipPincode: {
    type: String,
  },
  QuotationNumber: {
    type: String,
  },
  PONumber: {
    type: String,
  },
  PODate: {
    type: String,
  },
  OPSId: {
    type: String,
  },
  OPSDate: {
    type: String,
  },
  SalesEngineer: {
    type: String,
  },
  fullName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  Note: {
    type: String,
  },
  Terms: {
    type: String,
  },
  ClientName: {
    type: String,
  },
  Status: {
    type: String,
    default: "In Progress",
  },
  CertificateNote: {
    type: String
  },
  InvoiceNote: {
    type: String,
  },
  Certificate: {
    type: String,
  },
  Invoice: { type: String },
  buttonName: {
    type: String,
  }
});
const ProposalData = mongoose.model("newProposal", adminDataSchema);
module.exports = ProposalData;
