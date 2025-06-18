const mongoose = require("mongoose");
const { Schema } = mongoose;

const manageroledataSchema = new Schema({
  roleName: {
    type: String,
    require: true,
  },
  manageUser: {
    type: Boolean,
    default: false,
  },
  manageRole: {
    type: Boolean,
    default: false,
  },
  manageOrder: {
    type: Boolean,
    default: false,
  },
  manageClients: {
    type: Boolean,
    default: false,
  },
  manageOPS: {
    type: Boolean,
    default: false,
  },
  manageInvoice: {
    type: Boolean,
    default: false,
  },
  manageProducts: {
    type: Boolean,
    default: false,
  },
  manageDepartment: {
    type: Boolean,
    default: false,
  },
  manageDCR: {
    type: Boolean,
    default: false,
  },
});

const manageroleData = mongoose.model("manageroleData", manageroledataSchema);
module.exports = manageroleData;
