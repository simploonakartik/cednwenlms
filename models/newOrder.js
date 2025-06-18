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
    CertificateNote: {
        type: String
    },
    InvoiceNote: {
        type: String
    },
    Certificate: {
        type: String
    },
    Invoice: { type: String },
});
const OrderData = mongoose.model("newOrder", adminDataSchema);
module.exports = OrderData;
