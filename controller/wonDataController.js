const wonData = require("../models/wonDataModel");

const AddwonData = async (req, res) => {
    try {
        const newOrder = new wonData(req.body);
        const savedProposalData = await newOrder.save();
        res.status(201).json(savedProposalData);
    } catch (error) {
        console.error("Error in saving order:", error);
        res.status(500).json({ message: "An error occurred while saving the order." });
    }
};

const GetwonData = async (req, res) => {
    try {
        const response = await wonData.find();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
};

const updatewonData = async (req, res) => {
    try {
        const { id } = req.params;
        const { InvoiceNote, CertificateNote } = req.body;
        const baseURL = "http://localhost:5000/uploads/";
        const Invoice = req.files?.Invoice ? `${baseURL}${req.files.Invoice[0].filename}` : null;
        const Certificate = req.files?.Certificate ? `${baseURL}${req.files.Certificate[0].filename} ` : null;
        const updatedadminProduct = await wonData.findByIdAndUpdate(
            id, {
            InvoiceNote,
            CertificateNote,
            Invoice: Invoice || undefined,
            Certificate: Certificate || undefined
        },
            { new: true }
        );
        res.status(200).json(updatedadminProduct);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).send("Server error");
    }
};

const DeletewonData = async (req, res) => {
    try {
        const id = req.params.id;
        await wonData.findByIdAndDelete(id);
        res.status(200).send("Product deleted");
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Server error");
    }
};

module.exports = {
    AddwonData,
    GetwonData,
    updatewonData,
    DeletewonData,
};
