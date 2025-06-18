const adminData = require("../models/adminDataModel");

const adminDataController1 = async (req, res) => {
  try {
    const adminproduct = new adminData(req.body);
    const savedadminProduct = await adminproduct.save();
    res.status(201).json(savedadminProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Server error");
  }
};

const adminDataController2 = async (req, res) => {
  try {
    const adminDataproducts = await adminData.find();
    res.status(200).json(adminDataproducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

const adminDataController3 = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedadminProduct = await adminData.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedadminProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Server error");
  }
};

const adminDataController4 = async (req, res) => {
  try {
    const { id } = req.params;
    await adminData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  adminDataController1,
  adminDataController2,
  adminDataController3,
  adminDataController4,
};
