const userLogin = require("../models/loginModel");
const userData = require("../models/userDataModel");
const cmData = require("../models/cmDataModel");
const ProposalData = require("../models/proposalModel");  
const loginController = async (req, res) => {
  try {
    const data = new userLogin(req.body);
    const savedData = await data.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
};

const userDataController1 = async (req, res) => {
  try {
    const product = new userData(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Server error");
  }
};

const cmDataController1 = async (req, res) => {
  try {
    const cmproduct = new cmData(req.body);
    const savedcmProduct = await cmproduct.save();
    res.status(201).json(savedcmProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Server error");
  }
};

const userDataController2 = async (req, res) => {
  try {
    const products = await userData.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

const cmDataController2 = async (req, res) => {
  try {
    const cmproducts = await cmData.find();
    res.status(200).json(cmproducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

const userDataController3 = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await userData.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Server error");
  }
};

const cmDataController3 = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedcmProduct = await cmData.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedcmProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Server error");
  }
};

const userDataController4 = async (req, res) => {
  try {
    
    const { id } = req.params;
    await userData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

const cmDataController4 = async (req, res) => {
  try {
    const { id } = req.params;
    await cmData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  loginController,
  userDataController1,
  userDataController2,
  userDataController3,
  userDataController4,
  cmDataController1,
  cmDataController2,
  cmDataController3,
  cmDataController4,
};
