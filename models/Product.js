const mongoose = require("mongoose");
const { Schema } = mongoose;

const userdataSchema = new Schema({
  productName: {
    type: String,
  },
  licenseType: {
    type: String,
  },
  skuId: {
    type: String,
  },
  description: {
    type: String,
  },
  sellingPrice: {
    type: String,
  },
  GST: {
    type: String,
    default: 18
  },

});

const PRODUCT = mongoose.model("product", userdataSchema);
module.exports = PRODUCT;