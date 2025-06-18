const ProposalAll = require("../models/ProposalAllModel");

const proposalSave = async (req, res) => {
  try {
    const data = req.body;
    const result = await ProposalAll.insertMany(data);
    res
      .status(201)
      .json({ message: "Data inserted successfully!", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
const proposalGet = async (req, res) => {
  try {
    const result = await ProposalAll.find();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res
      .status(500)
      .json({
        message: "Server error. Unable to retrieve proposals.",
        error: error.message,
      });
  }
};
const proposalDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProposalAll.findByIdAndDelete(id);
    res.status(200).send("Product deleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Server error");
  }
};
module.exports = { proposalSave, proposalGet, proposalDelete };
