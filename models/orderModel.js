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

    ProposalName: {
        type: String,
    },
    ProposalID: {
        type: String,
    },
    ValidityDate: {
        type: String,
    },
    PaymentTerms: {
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
    CertificateNote: {
        type: String
    },
    InvoiceNote: {
        type: String
    },
    Certificate: {
        type: String
    },
    Invoice: {
        type: String
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    city: {
        type: String
    },
    clientID: {
        type: String
    },
    companyName: {
        type: String
    },
    emailId: {
        type: String
    },
    fullName: {
        type: String
    },
    gstNO: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    pincode: {
        type: String
    },
    state: {
        type: String
    },
});
const Order = mongoose.model("Order", adminDataSchema);
module.exports = Order;
