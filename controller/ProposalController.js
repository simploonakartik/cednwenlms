const ProposalData = require("../models/proposalModel");

const AddNewproposal = async (req, res) => {
  try {
    const response = ProposalData(req.body);
    const savedProposalData = await response.save();
    res.status(201).json(savedProposalData);
  } catch (error) {
    console.log(error);
  }
};
   
const GetNewproposal = async (req, res) => {
  try {
    const response = await ProposalData.find();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const updateproposal = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedadminProduct = await ProposalData.findByIdAndUpdate(
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

const DeleteNewproposal = async (req, res) => {
  try {
    const id = req.params.id;
    await ProposalData.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  AddNewproposal,
  GetNewproposal,
  DeleteNewproposal,
  updateproposal,
};
