const departmentData = require("../models/departmentModel");

const addDepartmentData = async (req, res) => {
  try {
    const adminproduct = new departmentData(req.body);
    const savedadminProduct = await adminproduct.save();
    res.status(201).json(savedadminProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Server error");
  }
};

const getDepartmentData = async (req, res) => {
  try {
    const adminDataproducts = await departmentData.find();
    res.status(200).json(adminDataproducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

const updateDepartmentData = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedadminProduct = await departmentData.findByIdAndUpdate(
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

const deleteDepartmentData = async (req, res) => {
  try {
    const { id } = req.params;
    await departmentData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addDepartmentData,
  getDepartmentData,
  updateDepartmentData,
  deleteDepartmentData,
};
