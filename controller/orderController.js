const Order = require("../models/orderModel");

const AddNeworder = async (req, res) => {
    try {
        
        const order = new Order(req.body)
        const savedProposalData = await order.save();
        res.status(201).json(savedProposalData);
    } catch (error) {
        console.error("Error in saving order:", error);
        res.status(500).json({ message: "An error occurred while saving the order." });
    }
};

const GetNeworder = async (req, res) => {
    try {
        const response = await Order.find();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }  
};

const updateorder = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedadminProduct = await Order.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedadminProduct);
    } catch (error) {
        console.error("Error updating proposal:", error);
        res.status(500).send("Server error");
    }
};

const DeleteNeworder = async (req, res) => {
    try {
        const id = req.params.id;
        await Order.findByIdAndDelete(id);
        res.status(200).send("Product deleted");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Server error");
    }
};

module.exports = {
    AddNeworder,
    GetNeworder,
    DeleteNeworder,
    updateorder,
};
