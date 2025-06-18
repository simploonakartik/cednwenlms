const DCRData = require("../models/DCR");

const addDcrData = async (req, res) => {
  const {companyName, address1, address2, city, clientID, emailId, fullName, gstNO, phoneNumber, pincode, state, pocSections, comment ,currentDate,currentTime,PAN,createdBy,department} = req.body;

  try {
    const newDcrData = new DCRData({companyName, address2, address1, city, clientID, emailId, fullName, gstNO, phoneNumber, pincode, state, pocSections, comment ,currentDate,currentTime,PAN,department,createdBy});

    const savedDcrData = await newDcrData.save();
    res.status(201).json(savedDcrData);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Server error");
  }
};


const getDcrData = async (req, res) => {
  try {
    const adminDataproducts = await DCRData.find();
    res.status(200).json(adminDataproducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");
  }
};

const updateDecrData = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedadminProduct = await DCRData.findByIdAndUpdate(
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

const deleteDcrData = async (req, res) => {
  try {
    const { id } = req.params;
    await DCRData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addDcrData,
  getDcrData,
  updateDecrData,
  deleteDcrData,
};
