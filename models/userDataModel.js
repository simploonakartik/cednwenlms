const mongoose = require("mongoose");
const { Schema } = mongoose;

const userdataSchema = new Schema({
  productName: {
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
  licenseType: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  GST: {
    type: Number,
    default: 18,
  },
});

const userData = mongoose.model("userData", userdataSchema);
module.exports = userData;
