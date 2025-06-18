const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminDataSchema = new Schema({
  
    rows: [
        {
            Amount: { type: Number },
            Tax: { type: Number },
            Quantity: { type: Number },
            Rate: { type: Number },
            SelectProducts: {
                type: String,
            },
        },
    ],
    BillAddress: {
        type: String,
    },
    BillCity: {
        type: String,
    },
    BillCompanyName: {
        type: String,
    },
    BillPincode: {
        type: String,
    },
    BillState: {
        type: String,
    },
    Certificate: {
        type: String,
    },
    CertificateNote: {
        type: String,
    },
    ClientName: {
        type: String
    },
    Invoice: {
        type: String
    },
    InvoiceNote: {
        type: String
    },
    Note: { type: String },
    OPSDate: {
        type: String
    },
    OPSId: {
        type: String
    },
    PODate: {
        type: String
    },
    PONumber: {
        type: String
    },
    QuotationNumber: {
        type: String
    },
    SalesEngineer: {
        type: String
    },
    ShipAddress: {
        type: String
    },
    ShipCity: {
        type: String
    },
    ShipCompanyName: {
        type: String
    },
    ShipPincode: {
        type: String
    },
    ShipState: {
        type: String
    },
    Status: {
        type: String
    },
    Terms: {
        type: String
    },
    emailId: {
        type: String
    },
    fullName: {
        type: String
    },
});
const WonData = mongoose.model("wondata", adminDataSchema);
module.exports = WonData;
