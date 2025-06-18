const InvoiceData = require("../models/InvoiceModel");

const AddInvoice = async (req, res) => {
  try {
    const response = InvoiceData(req.body);
    const savedProposalData = await response.save();
    res.status(201).json(savedProposalData);
  } catch (error) {
    console.log(error);
  }
};
   
const GetInvoice = async (req, res) => {
  try {
    const response = await InvoiceData.find();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedadminProduct = await InvoiceData.findByIdAndUpdate(
      id,
      req.body,
      { new: true }   
    );
    console.log("Received FormData:", req.body);
    res.status(200).json(updatedadminProduct);
  } catch (error) {
    console.error("Error updating proposal:", error);
    res.status(500).send("Server error");
  }
};

const DeleteInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    await InvoiceData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
    AddInvoice,
    GetInvoice,
    updateInvoice,
    DeleteInvoice,
};
