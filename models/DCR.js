const mongoose = require("mongoose");
const { Schema } = mongoose;

const DCRschema = new Schema({
    companyName: {
        type: String
    },
    clientID: {
        type: String
    },
    fullName: {
        type: String
    },
    emailId: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    gstNO: {
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
    state: {
        type: String
    },
    pincode: {
        type: String
    },
    PAN: {
        type: String
    },
    createdBy: {
        type: String
    },
  
    comment: {
        type: String,
    },
    comments: [{
        id: {
            type: Number,
        },
        value: {
            type: String,
        },
        currentsDate: {
            type: String,
        },
        currentsTime: {
            type: String,
        },
    }]
    ,
    status: {
        type: String,
        default: "Prospect"
    },
    currentDate: {
        type: String
    },
    currentTime: {
        type: String
    },
    pocSections: [
        {
            Name: {
                type: String,
            },
            designation: {
                type: String,
            },
            email: {
                type: String,
            },
            phone: {
                type: String,
            },
            department: {
                type: String
            },
        },
    ],
});

const DCRData = mongoose.model("DCR", DCRschema);

module.exports = DCRData;