const PRODUCT = require("../models/Product");

const PostproductDataControl = async (req, res) => {
  try {
    const { productName, licenseType, skuId, description, sellingPrice, GST } =
      req.body;
    const user = new PRODUCT({
      productName,
      licenseType,
      skuId,
      description,
      sellingPrice,
      GST,
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log("Error in PostuserDataControl:", error);
  }
};

const GetprductDataControl = async (req, res) => {
  try {
    const user = await PRODUCT.find();
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in GetuserDataControl:", error);
  }
};

const PutproductDataControl = async(req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await PRODUCT.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in PutuserDataControl:", error);
  }
};

const DeleteproductDataControl = async(req, res) => {
 try {
    const { id } = req.params;
    await PRODUCT.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.log("Error in DeleteuserDataControl:", error);
  }
};
module.exports = {
  PostproductDataControl,
  GetprductDataControl,
  PutproductDataControl,
  DeleteproductDataControl,
};
