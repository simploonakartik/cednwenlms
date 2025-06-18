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
  paymentrecord: [
    {
      discount: { type: String },
      remainingAmount: { type: String },
      Time: { type: String },
      Date: { type: String },
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
});
const InvoiceData = mongoose.model("invoice", adminDataSchema);
module.exports = InvoiceData;
